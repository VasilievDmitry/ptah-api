'use strict';

const ObjectID = require("bson-objectid");

const badRequest = require('./helpers/bad-request');
const findLandings = require('./helpers/find-landings');
const getLandingMeta = require('./helpers/get-landing-meta');
const updateLandingData = require('./helpers/update-landing-data');
const getDbCollection = require('../utils/get-db-collection');

module.exports = async (ctx, next) => {
    const id = ctx.params.id;
    const body = ctx.request.body || {};

    const domain = (body.domain || '').trim();
    if (!domain) {
        return badRequest();
    }

    let data = {};
    try {
        const landings = await findLandings(ctx, [id]);
        const landing = landings[0];
        if (landing) {

            data = updateLandingData(ctx, landing, {
                domain: domain
            });

            const collection = getDbCollection(ctx);

            await collection.updateOne({_id: ObjectID(id)}, {$set: data});
        }
    } catch (err) {
        throw err
    }

    ctx.status = 200;
    ctx.body = getLandingMeta(data);
    next();
};