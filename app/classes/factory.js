"use strict";

const _ = require('lodash');

const config = require('../../config/config');

const getDbCollection = require('./../utils/get-db-collection');

const {Mail} = require('./mail.class');
const {User} = require('./user.class');
const {UserSession} = require('./user-session.class');
const {UserUploads} = require('./user-uploads.class');

module.exports = {

    Mail: function (ctx) {
        const params = {
            emailPostmarkToken: config.emailpostmarkToken,
            emailSenderFrom: config.emailSenderFrom,
            publicHost: config.publicHost,
        }

        const templates = {
            emailTemplateConfirmEmail: config.emailTemplateConfirmEmail,
            emailTemplateUserSignupLocal: config.emailTemplateUserSignupLocal,
            emailTemplateUserSignupSocial: config.emailTemplateUserSignupSocial,
            emailTemplateRestorePassword: config.emailTemplateRestorePassword,
            emailTemplateRestorePasswordRequest: config.emailTemplateRestorePasswordRequest,
        }

        return new Mail(ctx, params, templates);
    },

    User: function (ctx, collection) {
        if (!ctx && !collection) {
            throw new Error('no collection and no ctx')
        }

        const params = {
            passwordSecret: config.passwordSecret,
            restorePasswordSecret: config.restorePasswordSecret,
            restorePasswordLifetime: config.restorePasswordLifetime,
            confirmEmailSecret: config.confirmEmailSecret,
            confirmEmailLifetime: config.confirmEmailLifetime,
        }

        if (ctx && !collection) {
            collection = getDbCollection.users(ctx)
        }

        return new User(ctx, collection, params);
    },

    UserSession: function(ctx, collection) {
        if (!ctx && !collection) {
            throw new Error('no collection and no ctx')
        }

        if (ctx && !collection) {
            collection = getDbCollection.users_sessions(ctx)
        }

        const params = {
            authTokenSecret: config.authTokenSecret,
            accessTokenLifetime: config.accessTokenLifetime,
            refreshTokenLifetime: config.refreshTokenLifetime,
            authCheckUserAgent: config.authCheckUserAgent,
            authCheckIP: config.authCheckIP,
        }

        return new UserSession(ctx, collection, params);
    },

    UserUploads: function(ctx, params, collection) {
        if (!ctx && !collection) {
            throw new Error('no collection and no ctx')
        }

        if (ctx && !collection) {
            collection = getDbCollection.users_uploads(ctx)
        }

        params = Object.assign({}, {
            userId: _.get(ctx, config.userIdStatePath, ''),
            maxFileSize: config.maxFileSize,
            maxTotalFilesSize: config.maxTotalFilesSize,
        }, params || {});


        return new UserUploads(ctx, collection, params);
    }
};
