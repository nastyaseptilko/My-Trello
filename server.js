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
const commentController = require('./controllers/commentController');

const jwtSecret = 'asdfghjklll4567poiuytr45ewqsxcvhrg7ytrdfghjnbv123890';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(cookieParser());
app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
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

app.use('/api', function (request, response, next) {
    if (!request.user) {
        response.redirect('/login');
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

//TODO: update url name!
app.get('/api/board', (request, response) => boardController.getPageBoard(request, response, request.user.id));
app.get('/api/boards', boardController.getBoards);
app.get('/api/lists/:board_id', listsController.getLists);
app.get('/api/addBoard', boardController.getFormBoard);
app.get('/api/card/:id', cardController.detailsCard);
app.get('/api/addCard', cardController.getFormCard);
app.get('/api/board/:set_list_id/:board_id', listsController.getPageLists);
app.get('/api/addList/:set_list_id', listsController.getFormList);
app.get('/api/comment/:id', commentController.getComments);

app.post('/login', authorizationController.login);
app.post('/register', authorizationController.register);
app.post('/api/addBoard', (request, response) => boardController.addBoard(request, response, request.user.id));
app.post('/api/addCard', cardController.addCard);
app.post('/api/addList/:set_list_id', listsController.addList);
app.post('/api/addComment/:id', commentController.addComment);

app.put('/api/updateCard/:id', cardController.updateCard);
app.put('/api/updateComment/:id', commentController.updateComment);
app.put('/api/board/:id', boardController.updateBoard)

app.delete('/api/deleteCard/:id', cardController.deleteCard);
app.delete('/api/deleteComment/:id', commentController.deleteComment);
app.delete('/api/board/:id', boardController.deleteBoard)


app.listen(process.env.PORT || config.server.port, () => {
    console.log(`Listening to http://localhost:${config.server.port}/`);
});
