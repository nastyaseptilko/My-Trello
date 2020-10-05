const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const  _handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const flash = require('connect-flash');
const config = require('./config');
const db = require('./model/');
const app = express();

const authorizationController = require('./controllers/authorizationController');
const authorizationGoogle= require('./controllers/authorizationGoogle');
const mainPageController = require('./controllers/mainPageController');
const boardController = require('./controllers/boardController');
const cardController = require('./controllers/cardController');
const listsController = require('./controllers/listsController');


const jwtSecret = 'asdfghjklll4567poiuytr45ewqsxcvhrg7ytrdfghjnbv123890';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(cookieParser());
// app.engine('handlebars', expressHandlebars());
app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}))
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: jwtSecret}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

let userProfile;

passport.use(new GoogleStrategy({
        clientID: '948752186836-875s16i6pgmbsm3h3ljk5gsho4n3gsip.apps.googleusercontent.com',
        clientSecret: '8yeosfCFBccmVRcZag_Pe2lS',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        userProfile = profile;
        return done(null, userProfile);
    })
);

app.use('/', function (request, response, next) {
    const token = request.cookies.token;
    if (token) {
        jwt.verify(token, jwtSecret, function (err, decoded) {
            if (err) {
                authorizationController.getPageLogin(request, response);
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        next();
    }
});

app.use('/addBoard', function (request, response, next) {
    if (!request.user) {
        authorizationController.getPageLogin(request, response);
    } else {
        next();
    }
});

app.use('/board', function (request, response, next) {
    if (!request.user) {
        authorizationController.getPageLogin(request, response);
    } else {
        next();
    }
});

app.use('/addCard', function (request, response, next) {
    if (!request.user) {
        authorizationController.getPageLogin(request, response);
    } else {
        next();
    }
});

app.get('/', mainPageController.getPageMain);
app.get('/login', authorizationController.getPageLogin);
app.get('/success', (request, response) => authorizationGoogle.authWithSocialNetwork(request, response, userProfile));
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/success'
}));
app.get('/register', authorizationController.getPageRegister);
app.get('/logout', authorizationController.logout);
app.get('/board', (request, response) => boardController.getPageBoard(request, response, request.user.id));
app.get('/addBoard', boardController.getFormBoard);
app.get('/addCard', cardController.getFormCard);
app.get('/board/:set_list_id/:board_id', listsController.getPageLists);
app.get('/addList', listsController.getFormList);

app.post('/login', authorizationController.login);
app.post('/register', authorizationController.register);
app.post('/addBoard', (request, response) => boardController.addBoard(request, response, request.user.id));
app.post('/addCard', cardController.addCard);
app.post('/addList', listsController.addList);

app.listen(process.env.PORT || config.server.port, () => {
    console.log(`Listening to http://localhost:${config.server.port}/`);
});
