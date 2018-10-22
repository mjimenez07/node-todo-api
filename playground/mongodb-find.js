const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
   if (error) {
       throw error;
   }

   console.log('Connected to the MongoDB server');
   const db = client.db('TodoApp');
   //
   // db.collection('Todos').find({
   //     _id: new ObjectID('5bcde08c663ebe796c20583b')
   // }).toArray().then((docs) => {
   //     console.log('Todos');
   //     console.log(JSON.stringify(docs, null, 2));
   // }).catch((error) => {
   //     console.log('Unable to fetch todos', error);
   // });

    // db.collection('Todos').find(error).count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }).catch((error) => {
    //     console.log('Unable to fetch todos', error);
    // });

    db.collection('Users')
        .find({name: 'Fernando'})
        .toArray().then((data) => {
            console.log(JSON.stringify(data, undefined, 2));
    })
        .catch((error) => {
            console.log('Unable to fetch the current query');
            throw error;
        });

   client.close();
});