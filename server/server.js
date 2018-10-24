const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    const { text } = request.body || '';

    const todo = new Todo({
        text
    });

    todo.save().then((data) => {
        response.send(data);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) =>{
        response.send({todos});
    }).catch((error) => {
       response.status(400).send(error);
   });
});

app.get('/todos/:id',  (request, response) => {
    const { id } = request.params;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', (request, response) => {
    const { id } = request.params;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        return response.send({ todo });
    }).catch((error) => {
        return response.status(404).send()
    });
});

app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
