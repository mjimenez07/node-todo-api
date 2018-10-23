const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5bcf344287deae25e23345b23';

// Todo.find({
//     _id: id
// }).then((todos) => {
//    console.log('Todos', todos);
// });
//
// Todo.findOne({
//    _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// if (!ObjectID.isValid(id)) {
//     console.log('Not a valid id', id);
// }

// Todo.findById(id)
//     .then((todo) => {
//         console.log('Todo by ID', todo);
//     })
//     .catch(error => console.log(error));

User.findById('5bce2231c390451451963801')
    .then((user) => {
        if (!user) {
            return console.log('Unable to fetch user');
        }
        console.log(user);
    })
    .catch(error => console.log(error));