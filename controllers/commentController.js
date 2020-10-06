const db = require('./../model');
const nodemailer = require('nodemailer');

module.exports = {

    getComments(request, response) {
        const id = request.params.id;

        db.Comment.findAll({
            where: {
                card_id: id
            }
        }).then(comments => {
            response.render('comments', {
                title: 'Comment',
                layout: 'card',
                listComments: comments
            })
        })
    },

    addComment(request, response) {
        const id = request.params.id;
        const body_comment = request.body.comment;
        let email = '';

        console.log("comment: " + body_comment)

        // if (body_comment.includes("@")) {
        //     console.log("email: " + email)
        //     if (validateEmail(email)) {
        //
        //         sendMessageEmail(email).then(result => result)
        //     }
        //     else{
        //         console.log('error')
        //     }
        // }

        if (body_comment) {
            db.Comment.create({
                where: {
                    card_id: id
                },
                body_comment: body_comment,
                card_id: id
            }).then(comment => {

                if (comment.body_comment.includes("@")) {
                    const regExp = /^(([^<>()[].,;:s@"]+(.[^<>()[].,;:s@"]+)*)|(".+"))@(([^<>()[].,;:s@"]+.)+[^<>()[].,;:s@"]{2,})$/i;
                   // let email = comment.body_comment.search(regExp);
                    let email = regExp.test(comment.body_comment)
                    console.log("email: " + email)
                    sendMessageEmail(email).then(r => r);
                }

                response.json(comment)
            })

        } else {
            response.status(401).send('<h1>Body empty!</h1>');
        }
    },

    updateComment(request, response) {
        const comment_id = request.params.id;
        const body_comment = request.body.bodyComment;

        console.log(body_comment)

        db.Comment.update({body_comment: body_comment}, {
            where: {
                id: comment_id
            }
        }).then(result => response.json(result));
    },

    deleteComment(request, response) {
        const comment_id = request.params.id;
        const deleteComment = {id: comment_id}

        return db.Comment.destroy({
            where: deleteComment
        }).then(isDeleted => {
            if (isDeleted) {
                response.json(deleteComment);
            } else {
                response.status(401).end('<h1>No such records have been found</h1>')
            }
        });
    }

}

async function sendMessageEmail(email) {
    let testEmailAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: testEmailAccount.user,
            pass: testEmailAccount.pass
        }
    });
    let result = await transporter.sendMail({
        from: '"Node js" <nodejs@example.com>',
        to: email,
        subject: 'New position',
        text: 'text'
    });
    console.log('Send email to: ' + email);
}

