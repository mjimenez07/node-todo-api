const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        throw error;
    }

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos')
    //     .deleteMany({ text: 'Eat lunch' })
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         throw error;
    //     });

    // db.collection('Todos')
    //     .deleteOne({ text: 'Eat lunch' })
    //     .then((result) => {
    //         console.log('Result: ', result);
    //     })
    //     .catch((error) => {
    //          throw error;
    //     });

    db.collection('Todos')
        .findOneAndDelete({ completed: false })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            throw error;
        });
});