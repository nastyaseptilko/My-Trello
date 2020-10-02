const jwt = require('jsonwebtoken');
const db = require('./../model');

module.exports = {

    getPageMain(request, response){
        response.render('main', {
            title: 'Trello',
            layout: 'mainPage'
        });
    }
}