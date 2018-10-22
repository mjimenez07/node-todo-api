const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        throw error;
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    // db.collection('Todos')
    //     .findOneAndUpdate({ _id: new ObjectID('5bce0dad663ebe796c205be2')}, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     });
    //     .catch(error);

    db.collection('Users')
        .findOneAndUpdate({ _id: new ObjectID('5bcddaa273b1500983064244')}, {
            $set: {
                name: 'Mario Jimenez'
            },
            $inc: {
                age: +1
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log('Result: ', result);
        })
        .catch((error) => {
            throw error;
        });
});