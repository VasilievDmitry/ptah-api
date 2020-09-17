"use strict";

const Factory = require('./factory');
const getDbCollection = require('../utils/get-db-collection');

class FeatureCheck {
    static codeMap = {
        landings_count: this.LandingsCountCheck,
        uploads_quote: this.UploadsQuoteCheck,
        own_domain: this.OwnDomainCheck,
    }

    // value - maximum allowed number of landings
    static async LandingsCountCheck(ctx, userId, value, includeEqual = false) {
        value = (value || 0) * 1;

        const condition = {
            isDeleted: false,
            userId: userId
        };

        const collection = getDbCollection.landings(ctx);

        let result = [];

        try {
            const r = await ctx.mongoTransaction(
                collection,
                'find',
                [
                    condition,
                    {projection: {landing: 0}},
                ]
            )

            result = await r.toArray();
        } catch (err) {
            return false;
        }

        return Array.isArray(result) && includeEqual ? result.length <= value : result.length < value;
    }

    // value - maximum allowed quote in megabytes
    static async UploadsQuoteCheck(ctx, userId, value, includeEqual = false) {
        const _value = (value || 0) * 1024 * 1024;

        const user = Factory.User(ctx);
        await user.FindById(userId);

        const params = {
            user: user,
        }

        const userUploads = await Factory.UserUploads(ctx, params);
        const spaceUsed = await userUploads.getUserUploadsSize();

        return includeEqual ? spaceUsed <= _value : spaceUsed < _value;
    }

    static async OwnDomainCheck(ctx, userId, value, includeEqual = false, landing = null) {
        value = (value || 0) * 1;

        if (value === 1) {
            return true;
        }

        if (landing) {
            return landing.domain.indexOf(config.landingsPublishingHost) >= 0;
        }

        const condition = {
            isDeleted: false,
            userId: userId
        };

        const collection = getDbCollection.landings(ctx);

        let result = [];

        try {
            const r = await ctx.mongoTransaction(
                collection,
                'find',
                [
                    condition,
                    {projection: {landing: 0}}
                ]
            )

            result = await r.toArray();
        } catch (err) {
            return false;
        }

        for (let landing of result) {
            if (landing.isPublished && landing.domain.indexOf(config.landingsPublishingHost) < 0) {
                return false;
            }
        }

        return true;
    }

    static async CheckByCode(code, ctx, userId, value, includeEqual, landing) {
        return await this.codeMap[code](ctx, userId, value, includeEqual, landing);
    }
}

module.exports = {
    FeatureCheck
}
