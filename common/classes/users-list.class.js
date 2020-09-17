"use strict";

const getDbCollection = require('../utils/get-db-collection');
const subscriptionStates = require('./subscription-state');

class UsersList {

    constructor(ctx) {
        this.ctx = ctx;
        this.collection = getDbCollection.users(ctx);
        return this;
    }

    async GetActive() {
        const condition = {
            isDeleted: false
        }
        return this.find(condition);
    }

    async GetSuspendedBilling() {
        const todayBegin = new Date((new Date()).toISOString().split('T')[0] + 'T00:00:00');

        const daysAgo = new Date();
        daysAgo.setDate(todayBegin.getDate() - 3);

        const condition = {
            tariff: {"$ne": null},
            subscriptionState: {"$in": [subscriptionStates.active, subscriptionStates.cancelled]},
            "$or": [
                {lastBillingDate: {"$ne": null}},
                {lastBillingDate: {"$gte": daysAgo}},
                {lastBillingDate: {"$lt": todayBegin}},
            ],
            isDeleted: false,
        }
        return this.find(condition);
    }

    async GetActiveBilling() {
        const todayBegin = new Date((new Date()).toISOString().split('T')[0] + 'T00:00:00');

        const condition = {
            tariff: {"$ne": null},
            subscriptionState: {"$in": [subscriptionStates.active, subscriptionStates.cancelled]},
            "$or": [
                {lastBillingDate: {"$eq": null}},
                {lastBillingDate: {"$lt": todayBegin}},
            ],
            isDeleted: false,
        }
        return this.find(condition);
    }

    async find(conditions) {
        conditions = conditions || {};

        const options = {
            projection: {}
        };

        const query = Object.assign({}, conditions, {})

        try {
            const r = await this.ctx.mongoTransaction(
                this.collection,
                'find',
                [
                    query,
                    options
                ]
            )

            const result = await r.toArray();

            if (!result) {
                return null;
            }

            return result;

        } catch (err) {
            throw err;
        }
    }
}


module.exports = {
    UsersList
};
