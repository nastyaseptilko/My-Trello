const jwt = require('jsonwebtoken');
const db = require('./../model');

const jwtSecret = 'asdfghjklll4567poiuytr45ewqsxcvhrg7ytrdfghjnbv123890';

module.exports = {
    authWithSocialNetwork(request, response, userProfile){
        const email = userProfile.emails[0].value;
        const full_name = userProfile.name.familyName + ' ' + userProfile.name.givenName;

        db.Users.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user) {
                jwt.sign({ user: user }, jwtSecret, function(err, token) {
                    if (err) {
                        console.log('Generate token error');
                    } else {
                        response.cookie('token', token);
                    }
                    response.render('authGoogle', {
                        title: 'Login with Google',
                        layout: 'authGoogle',
                        familyName: userProfile.name.familyName,
                        givenName: userProfile.name.givenName,
                        email: userProfile.emails[0].value
                    });
                });
            } else {
                db.Users.create({
                    full_name: full_name,
                    email: email
                }).then(response.redirect('/login'))

            }
        });



    }

}
