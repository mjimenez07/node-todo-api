const  {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        console.log('Unable to connect to MongoDB server');
        throw error;
    }

    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (error, result) => {
    //     if (error) {
    //         throw error;
    //     }
    //
    //    console.log(JSON.stringify(result.ops, null, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Mario',
        age: 25,
        location: 'Dominican Republic'
    }, (error, result) => {
        if (error) {
            throw error;
        }

        console.log(JSON.stringify(result.ops, null, 2))

    });

    client.close();
});