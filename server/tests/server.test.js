const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

describe('POST /todos', () => {
    beforeEach((done) => {
        Todo.remove({}).then(() => done())
    });

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

                Todo.find().then((todos) => {
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
                   expect(todos.length).toBe(0);
                   done();
               }).catch(error => done(error));
            });
    });
});
