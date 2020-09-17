'use strict';

const {NOT_FOUND, INTERNAL_SERVER_ERROR} = require('../../../../config/errors');

const {Tariff} = require('../../../../common/classes/tariff.class');
const {TariffsList} = require('../../../../common/classes/tariffs-list.class');
const {FeaturesList} = require('../../../../common/classes/features-list.class');

module.exports = async (ctx, next) => {
    try {
        const id = ctx.params.id || '';

        const tariff = new Tariff(ctx);
        const t = await tariff.FindById(id);
        if (!t) {
            return ctx.throw(404, NOT_FOUND);
        }

        const name = ctx.request.body.name || '';
        const dayPrice = ctx.request.body.dayPrice;
        const periodDays = ctx.request.body.periodDays;
        const tariffFeatures = ctx.request.body.features;
        const isArchived = ctx.request.body.isArchived;

        const updateParams = {};
        if (name) {
            updateParams.name = name;
        }
        if (typeof dayPrice !== 'undefined' && !Number.isNaN(dayPrice)) {
            // noinspection PointlessArithmeticExpressionJS
            updateParams.dayPrice = dayPrice * 1;
        }
        if (typeof periodDays !== 'undefined' && isNumber(periodDays)) {
            // noinspection PointlessArithmeticExpressionJS
            updateParams.periodDays = periodDays * 1;
        }
        if (typeof isArchived !== 'undefined' ) {
            updateParams.isArchived = !!isArchived;
        }

        if (typeof tariffFeatures !== 'undefined' && Object.keys(tariffFeatures).length) {

            const featuresList = new FeaturesList(ctx);
            const features = await featuresList.GetAll();
            if (!features) {
                return ctx.throw(500, INTERNAL_SERVER_ERROR);
            }
            const activeFeaturesId = features.map(f => f.isArchived ? null : f._id.toString()).filter(Boolean);
            Object.keys(tariffFeatures).forEach(tf => {
                if (activeFeaturesId.indexOf(tf) < 0) {
                    return ctx.throw(400, FEATURE_NOT_FOUND_OR_ARCHIVED);
                }
            })
            updateParams.features = tariffFeatures;
        }

        let result = t;

        if (Object.keys(updateParams).length) {
            result = await tariff.Update(updateParams);
        }

        if (!result) {
            return ctx.throw(500, INTERNAL_SERVER_ERROR);
        }

        const tariffsList = new TariffsList(ctx);

        ctx.body = await tariffsList.GetById(result._id);


        ctx.status = 200;

    } catch (err) {
        return ctx.throw(err.status || 500, err.message)
    }

    next();
};
