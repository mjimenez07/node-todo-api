const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
   text: 'First todo',
}, {
    _id: new ObjectID(),
    text: 'Second todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() =>  {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo',  (done) => {
        const text = 'Foo bah';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(error => done(error));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, response) => {
               if (error) {
                   return done(error);
               }

               Todo.find({}).then((todos) => {
                   expect(todos.length).toBe(2);
                   done();
               }).catch(error => done(error));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos',  (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return the todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
               expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)

    });

    it('should return 404 if todo not found',  (done) => {
        const hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-objects ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(hexId).then((todo) => {
                   expect(todo).toBe(null);
                   done();
                }).catch(error => done(error));
            });

    });

    it('should return 404 if todo not found',  (done) => {
        const hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-objects ids', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const hexId = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: "Foo bah",
                completed: true
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe('Foo bah');
                expect(response.body.todo.completed).toBe(true);
                expect(response.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const hexId = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: "Foo bah",
                completed: false
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe('Foo bah');
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});