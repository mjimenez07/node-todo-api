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

app.post('/todos', authenticate, (request, response) => {
    const { text } = request.body;
    const _creator = request.user.id;

    const todo = new Todo({
        text,
        _creator
    });

    todo.save().then((data) => {
        response.send(data);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.get('/todos', authenticate, (request, response) => {
    Todo.find({
        _creator: request.user.id
    }).then((todos) =>{
        response.send({todos});
    }).catch((error) => {
       response.status(400).send(error);
   });
});

app.get('/todos/:id', authenticate, (request, response) => {
    const { id } = request.params; // Todo id
    const _creator  = request.user.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findOne({
        _creator,
        _id: id
    }).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (request, response) => {
    const { id } = request.params;
    const _creator  = request.user.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator
    }).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    }).catch((error) => {
        response.send(400).send()
    });
});

app.patch('/todos/:id',  authenticate, (request, response) => {
    const { id } = request.params;
    const _creator = request.user.id;
    const body = _.pick(request.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator
    }, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
       if (!todo) {
           return response.status(404).send();
       }

       response.send({todo});
    }).catch((error) =>  {
        response.send(400).send();
    });
});

app.post('/users', (request, response) => {
    const { email, password } = request.body;
    const user = new User({email, password});

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header('x-auth', token).send({user});
    }).catch((error) =>  {
        return response.status(400).send();
    });
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users/login', (request, response) => {
    const { email, password } = request.body;

    User.findByCredentials(email, password).then((user) => {
        return user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send({user});
        });
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }).catch((error) => {
        response.status(400).send();
    });
});

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
