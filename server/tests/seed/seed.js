const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userID = new ObjectID();
const secondUserID = new ObjectID();
const users = [{
    _id: userID,
    email: 'foo@bah.com',
    password: '123abc',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userID,
            access: 'auth'
        },
            process.env.JWT_SECRET).toString()
    }]
}, {
    _id: secondUserID,
    email: 'bah@bah.com',
    password: 'abc123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
                _id: secondUserID,
                access: 'auth'
            },
            process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First todo',
    _creator: userID
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    _creator: secondUserID
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() =>  {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};

