module.exports = {
    authWithSocialNetwork(request, response, userProfile){
        response.render('authGoogle', {
            title: 'Login with Google',
            layout: 'authGoogle',
            familyName: userProfile.name.familyName,
            givenName: userProfile.name.givenName,
            email: userProfile.emails[0].value
        });
    }

}
