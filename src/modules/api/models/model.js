'use strict';

var Model = "Temp";
exports.model = Model;

// use model
var validator = require('validator');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validateLocalStrategyEmail = function (email) {
    return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};


var ModelSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: '',
        required: 'Please fill in name'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayName: {
            type: String
        }
    }
});

mongoose.model(Model, ModelSchema);