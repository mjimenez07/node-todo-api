const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc';
bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (error, hash) => {
       console.log('bcrypt', hash);
    });
});

bcrypt.compare(password, '$2a$10$F2hetezjtTShJ.QmzWulguJjfYntbiGpyA0CrO1vckyx42DiMEO6.', (error, result) => {
    console.log(result);
});

const data = {
    id: 10
};

const token = jwt.sign(data, 'secret');
// console.log(token);
// console.log(jwt.verify(token, 'secret'));