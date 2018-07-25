'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    _model = require('../models/model').model,
    app = require('../../../config/express'),
    Model = mongoose.model(_model);

var credentials,
    token,
    mockup;

describe(_model + ' CRUD routes tests', () => {

    before((done) => {
        mockup = {
            name: 'test'
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com'
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be ' + _model + ' get use token', (done)=>{
        request(app)
        .get('/api/' + _model)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(done);
    });

    it('should be ' + _model + ' get by id use token', (done)=> {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/' + _model + '/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end( (err, res)=> {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, mockup.name);
                        done();
                    });
            });

    });

    it('should be ' + _model + ' post use token', (done) => {
        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.name, mockup.name);
                done();
            });
    });

    it('should be ' + _model + ' put use token', (done) => {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/' + _model + '/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    it('should be ' + _model + ' delete use token', (done) => {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/' + _model + '/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be ' + _model + ' get not use token', (done)=>{
        request(app)
        .get('/api/' + _model)
        .expect(403)
        .end(done);
    });

    it('should be ' + _model + ' get by id not use token', (done)=> {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/' + _model + '/' + resp.data._id)
                    .expect(403)
                    .end(done);
            });

    });

    it('should be ' + _model + ' post not use token', (done) => {

        request(app)
            .post('/api/' + _model)
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be ' + _model + ' put not use token', (done) => {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/' + _model + '/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be ' + _model + ' delete not use token', (done) => {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/' + _model + '/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Model.remove().exec(done);
    });

});