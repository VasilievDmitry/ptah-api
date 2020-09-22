'use strict';

const {UsersList} = require('../../../../common/classes/users-list.class');
const config = require('../../../../config/config');


module.exports = async (ctx, next) => {
    try {
        const limit = (ctx.query.limit || 0) * 1 || config.pagingDefaultLimit;
        const offset = (ctx.query.offset || 0) * 1 || 0;

        const usersList = new UsersList(ctx);

        const filter = {};

        if (ctx.query.subscriptionState !== undefined) {
            filter.subscriptionState = ctx.query.subscriptionState * 1;
        }

        if (ctx.query.tariff !== undefined) {
            filter.tariff = ctx.query.tariff;
        }

        if (ctx.query.emailConfirmed !== undefined) {
            filter.emailConfirmed = ctx.query.emailConfirmed === '1';
        }

        if (ctx.query.mailchimpIntegration !== undefined) {
            filter.mailchimpIntegration = ctx.query.mailchimpIntegration === '1';
        }

        ctx.body = await usersList.GetByFilters(filter, limit, offset);
        ctx.status = 200;


    } catch (err) {
        return ctx.throw(err.status || 500, err.message)
    }

    next();
};
