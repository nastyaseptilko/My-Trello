const https = require('https');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const _handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const flash = require('connect-flash');
const config = require('./config');
const app = express();

const authorizationController = require('./controllers/authorizationController');
const authorizationGoogle = require('./controllers/authorizationGoogle');
const mainPageController = require('./controllers/mainPageController');
const boardController = require('./controllers/boardController');
const cardController = require('./controllers/cardController');
const listsController = require('./controllers/listsController');
const commentController = require('./controllers/commentController');
const searchController = require('./controllers/searchController');

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
const googleCallbackUrl = config.server.herokuRun ? config.google.herokuCallbackUrl : config.google.localCallbackUrl;

passport.use(new GoogleStrategy({
        clientID: '948752186836-875s16i6pgmbsm3h3ljk5gsho4n3gsip.apps.googleusercontent.com',
        clientSecret: '8yeosfCFBccmVRcZag_Pe2lS',
        callbackURL: googleCallbackUrl
    },
    (accessToken, refreshToken, profile, done) => {
        userProfile = profile;
        return done(null, userProfile);
    })
);


let key;
let cert;
let server = app;
let port = config.server.portHttp;

if (!config.server.herokuRun) {
    try {
        key = fs.readFileSync('./certificates/resourcePrivateKey.key', 'utf8');
        cert = fs.readFileSync('./certificates/resourceCert.crt', 'utf8');

        port = config.server.portHttps;
        server = https.createServer({key, cert}, app);
    } catch (e) {
        app.all('*', (request, response) => {
            response.redirect(`https://${config.server.domainHttps}:${config.server.portHttps}${request.url}/`);
        });
    }
}


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
app.get('/api/board', (request, response) => boardController.getPageBoard(request, response, request.user.id));
app.get('/api/boards', boardController.getBoards);
app.get('/api/lists/:board_id', listsController.getLists);
app.get('/api/boardForm', boardController.getFormBoard);
app.get('/api/card/:id', cardController.detailsCard);
app.get('/api/card', cardController.getFormCard);
app.get('/api/board/:set_list_id/:board_id', listsController.getPageLists);
app.get('/api/list/:set_list_id', listsController.getFormList);
app.get('/api/comment/:id', commentController.getComments);
app.get('/api/search', searchController.getSearch);

app.post('/login', authorizationController.login);
app.post('/register', authorizationController.register);
app.post('/api/board', (request, response) => boardController.addBoard(request, response, request.user.id));
app.post('/api/card', cardController.addCard);
app.post('/api/list/:set_list_id', listsController.addList);
app.post('/api/comment/:id', commentController.addComment);

app.put('/api/card/:id', cardController.updateCard);
app.put('/api/comment/:id', commentController.updateComment);
app.put('/api/board/:id', boardController.updateBoard)

app.delete('/api/card/:id', cardController.deleteCard);
app.delete('/api/comment/:id', commentController.deleteComment);
app.delete('/api/board/:id', boardController.deleteBoard)


server.listen(process.env.PORT || port, () => {
    console.log(`Listening to https://localhost:${port}/`);
});
