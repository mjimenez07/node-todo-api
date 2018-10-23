const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    const { text } = request.body || '';

    const todo = new Todo({
        text
    });

    todo.save()
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            response
                .status(400)
                .send(error);
        });
});

app.listen(3000, () => {
   console.log('Started on port 3000');
});