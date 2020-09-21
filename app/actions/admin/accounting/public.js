'use strict';

const ObjectID = require('bson-objectid');

const {BAD_REQUEST} = require('../../../../config/errors');
const {AccountingUser} = require('../../../../common/classes/accounting.class');
const config = require('../../../../config/config');


module.exports = async (ctx, next) => {
    try {
        const userId = ctx.params.userId || '';
        if (!ObjectID.isValid(userId)) {
            return ctx.throw(404, BAD_REQUEST);
        }

        const operationCode = ctx.query.operationCode || '';

        const limit = (ctx.query.limit || 0) * 1 || config.pagingDefaultLimit;
        const offset = (ctx.query.offset || 0) * 1 || 0;

        const accountingUser = new AccountingUser(ctx);

        const history = await accountingUser.GetUserHistory(userId, operationCode, limit, offset);

        ctx.status = 200;
        ctx.body = {
            limit: limit,
            offset: offset,
            items: history,
            currency: 'USD',
        };

        if (userId) {
            ctx.body.balance = await accountingUser.GetUserBalance(userId);
        }

    } catch (err) {
        return ctx.throw(err.status || 500, err.message)
    }

    next();
};
