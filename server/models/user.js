const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    const userOBject = this.toObject();
    return _.pick(userOBject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  const access = 'auth';
  const token = jwt.sign({
      _id: this._id.toHexString(),
      access
  }, 'abc123');

  this.tokens = this.tokens.concat([{access, token}]);

  return this.save().then(() => {
      return token;
  });
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded  = jwt.verify(token, 'abc123')
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id':  decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
