"use strict";

const SUBSCRIPTION_STATE_INACTIVE = 0;
const SUBSCRIPTION_STATE_ACTIVE = 1;
const SUBSCRIPTION_STATE_SUSPENDED = -1;
const SUBSCRIPTION_STATE_CANCELLED = -2;

module.exports = {
    inactive: SUBSCRIPTION_STATE_INACTIVE,
    active: SUBSCRIPTION_STATE_ACTIVE,
    suspended: SUBSCRIPTION_STATE_SUSPENDED,
    cancelled: SUBSCRIPTION_STATE_CANCELLED,
};
