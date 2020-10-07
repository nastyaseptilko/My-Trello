const db = require('./../model');
const nodemailer = require('nodemailer');
const secretConfig = require('../secretConfig');

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

    async addComment(request, response) {
        const id = request.params.id;
        let body_comment = request.body.comment;

        const mentionedEmail = getMentionedEmail(body_comment);

        if (mentionedEmail) {
            const matchUser = await db.Users.findOne({
                where: { email: mentionedEmail },
                attributes: ['full_name']
            });
            if (matchUser) {
                body_comment = body_comment.replace(`@${mentionedEmail}`, matchUser.full_name);
            }
        }

        if (body_comment) {
            db.Comment.create({
                where: {
                    card_id: id
                },
                body_comment: body_comment,
                card_id: id
            }).then(comment => {
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

function getMentionedEmail(comment) {
    const EMAIL_SEARCH_REGEX = /@((([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))([\W]|$)/;
    const emailSearchResult = comment.match(EMAIL_SEARCH_REGEX);
    let email;
    if (emailSearchResult) {
        email = emailSearchResult[1];
        sendMessageEmail(email, comment);
    }
    return email;
}

async function sendMessageEmail(email, comment) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: secretConfig.user,
            pass: secretConfig.password
        }
    });

    let result = await transporter.sendMail({
        from: '"Node js" <nodejs@example.com>',
        to: email,
        subject: 'Final homework',
        html: comment
    });
    console.log('Send email to: ' + email);
}
