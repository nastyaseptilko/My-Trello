const jwt = require('jsonwebtoken');
const db = require('./../model');

const jwtSecret = 'asdfghjklll4567poiuytr45ewqsxcvhrg7ytrdfghjnbv123890';

module.exports = {
    getPageLogin(request, response) {
        response.render('login', {
            title: 'Login',
            layout: 'authorization',
            registerLink: true
        })
    },

    login(request, response) {
        const email = request.body.email;
        const password = request.body.password;

        db.Users.findOne({
            where: {
                email: email,
                password: password
            }
        }).then(user => {
            if (user) {
                jwt.sign({ user: user }, jwtSecret, function(err, token) {
                    if (err) {
                        console.log('Generate token error');
                    } else {
                        response.cookie('token', token);
                    }
                    response.redirect('/');
                });
            } else {
                response.render('login', {
                    title: 'Login',
                    layout: 'authorization',
                    error: 'Invalid email or password'
                });
            }
        });
    },

    logout(request,response){
        response.clearCookie('token');
        response.redirect('/login');
    },

    getPageRegister(request,response){
        response.render('register', {
            title: 'Register',
            layout: 'authorization',
            registerLink: false
        });
    },

    register(request, response) {
        const {
            password,
            confirmPassword,
            email,
            fullName
        } = request.body;

        if (!checkPasswords(password, confirmPassword, response)) { return; }

        db.Users.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user) {
                response.render('register', {
                    title: 'Register',
                    layout: 'authorization',
                    errorIsUser: 'This user is already registered'
                });
            } else {
                db.Users.create({
                    full_name: fullName,
                    email: email,
                    password: password
                }).then(user => {
                    response.render('login', {
                        title: 'Login',
                        layout: 'authorization'
                    });
                });
            }
        });
    }
}

function checkPasswords(password, confirmPassword, response) {
    if (password !== confirmPassword) {
        response.render('register', {
            layout: 'authorization',
            error: 'Invalid password'
        });
        return false;
    } else return true;
}
