'use strict';

const _ = require('lodash');
const ObjectID = require("bson-objectid");

const config = require('../../../../config/config');
const getDefaultLanding = require('../../landings/helpers/default-landing');
const getDbCollection = require('../../../../common/utils/get-db-collection');

module.exports = async (ctx, next) => {
    try {

        const options = {
            projection: {
                landing: 0,
                isDeleted: 0,
            }
        };

        const condition = {
            isDeleted: false,
        };

        const limit = (ctx.query.limit || 0) * 1 || config.pagingDefaultLimit;
        const offset = (ctx.query.offset || 0) * 1 || 0;

        if (ctx.query.userId !== undefined) {
            condition.userId = ObjectID(ctx.query.userId);
        }

        if (ctx.query.isPublished !== undefined) {
            condition.isPublished = ctx.query.isPublished === '1';
        }

        const collection = getDbCollection.landings(ctx);

        let result = [];

        const r = await ctx.mongoTransaction(
            collection,
            'find',
            [
                condition,
                options
            ]
        )

        result = await r.toArray();

        const defaultLanding = _.omit(getDefaultLanding(), ['landing', 'isDeleted']);

        ctx.body = {
            limit: limit,
            offset: offset,
            total: result.length,
            landings: result.slice(offset, offset + limit).map(l => Object.assign({}, defaultLanding, l))
        }

        ctx.status = 200;

    } catch (err) {
        throw err
    }
    next();
};
