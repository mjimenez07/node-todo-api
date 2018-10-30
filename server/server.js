require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, async (request, response) => {
    const { text } = request.body;
    const _creator = request.user.id;

    const todo = new Todo({
        text,
        _creator
    });

    try {
        const result = await todo.save();
        response.send(result);
    } catch(e) {
        response.status(400).send(e);
    }
});

app.get('/todos', authenticate, async (request, response) => {
    const { id: _creator } = request.user;

    try {
        const todos = await Todo.find({
            _creator
        });
        response.send({ todos });
    } catch(error) {
        response.status(400).send(error);
    }
});

app.get('/todos/:id', authenticate, async (request, response) => {
    const { id: _id } = request.params; // Todo id
    const _creator  = request.user.id;

    if (!ObjectID.isValid(_id)) {
        return response.status(404).send();
    }

    try {
        const todo = await Todo.findOne({
            _creator,
            _id
        });

        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    } catch (error) {
        response.status(400).send();
    }
});

app.delete('/todos/:id', authenticate, async (request, response) => {
    const { id } = request.params;
    const _creator  = request.user.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator
        });

        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    } catch (e) {
        response.send(400).send()
    }
});

app.patch('/todos/:id',  authenticate, async (request, response) => {
    const { id: _id } = request.params;
    const _creator = request.user.id;
    const body = _.pick(request.body, ['text', 'completed']);

    if (!ObjectID.isValid(_id)) {
        return response.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    try {
        const todo = await Todo.findOneAndUpdate({
            _id,
            _creator
        }, {
            $set: body
        }, {
            new: true
        });

       if (!todo) {
           return response.status(404).send();
       }

        response.send({ todo });
    } catch(error) {
        response.send(400).send();
    }
});

app.post('/users', async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = new User({ email, password });
        await user.save();
        const token = await user.generateAuthToken();
        response.header('x-auth', token).send({ user });
    } catch (e) {
        response.status(400).send();
    }
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users/login', async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        response.header('x-auth', token).send({ user });
    } catch (e) {
        response.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (request, response) => {
    try {
        await request.user.removeToken(request.token);
        response.status(200).send();
    } catch (e) {
        response.status(400).send();
    }
});

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
