const db = require('./../model');

module.exports = {

    getComments(request, response) {
        const id = request.params.id;

        db.Comment.findAll({
            where:{
                card_id: id
            }
        }).then(comment => {
            console.log('Comment: '+ JSON.stringify(comment, null, ' '))
            response.json(comment);
            // response.render('detailsCard', {
            //     title: 'Details',
            //     layout: 'card',
            //     listComments: comment
            // })
        })
    },

    addComment (request, response) {
        const id = request.params.id;
        const body_comment = request.body.comment;

        db.Comment.create({
            where:{
                card_id: id
            },
            body_comment:body_comment,
            card_id: id
        }).then(comment => {
            response.json(comment)
        })
    }
}