'use strict';

const Router  = require('koa-router');
const convert = require('koa-convert');
const KoaBody = require('koa-body');

const config = require('../../config/config');

const listLandings = require('../actions/list-landings');
const addLanding = require('../actions/add-landing');
const getLanding = require('../actions/get-landing');
const deleteLanding = require('../actions/delete-landing');
const publishLanding = require('../actions/publish-landing');
const unpublishLanding = require('../actions/unpublish-landing');

const router = new Router({
    prefix: config.routesPrefix
});
const koaBody = convert(KoaBody());

router
    .get('/', listLandings)
    .post('/', koaBody, addLanding)
    .get('/:id', getLanding)
    .delete('/:id', deleteLanding)
    .post('/:id/publishing', publishLanding)
    .delete('/:id/publishing', unpublishLanding)
    ;

module.exports.routes = function () { return router.routes() };
module.exports.allowedMethods = function () { return router.allowedMethods() };
