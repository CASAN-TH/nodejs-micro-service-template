'use strict';
var mongoose = require('mongoose'),
    _model = require('../models/model').model,
    Model = mongoose.model(_model),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = (req, res) => {
    Model.find((err, datas) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.create = (req, res) => {
    var mongooseModel = new Model(req.body);
    mongooseModel.createby = req.user;
    mongooseModel.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.getByID = (req, res, next, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Model.findById(id, (err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = (req, res) => {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = (req, res) => {
    var mongooseModel = _.extend(req.data, req.body);
    mongooseModel.updated = new Date();
    mongooseModel.updateby = req.user;
    mongooseModel.save((err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = (req, res) => {
    req.data.remove((err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};
