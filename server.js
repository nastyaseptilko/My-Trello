const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const expressHandlebars = require('express-handlebars');
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
const boardController = require('./controllers/boardController')

const jwtSecret = 'asdfghjklll4567poiuytr45ewqsxcvhrg7ytrdfghjnbv123890';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(cookieParser());
app.engine('handlebars', expressHandlebars());
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


app.use('/board', function (request, response, next) {
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
app.get('/board', boardController.getPageBoard);

app.get('/register', authorizationController.getPageRegister);
app.get('/logout', authorizationController.logout);

app.post('/login', authorizationController.login);
app.post('/register', authorizationController.register);
app.post('/addBoard', boardController.addBoard);

app.listen(process.env.PORT || config.server.port, () => {
    console.log(`Listening to http://localhost:${config.server.port}/`);
});
