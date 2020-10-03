const db = require('./../model');

module.exports = {
    getPageBoard (request, response) {
        response.render('board',{
            title: 'Board',
            layout: 'board',
        })

    },
    addBoard (request, response) {
        const board_name = request.body.boardName
        db.Board.findOne({
            where: {
                board_name: board_name
            }
        }).then(board => {
            if (board) {
                response.render('board', {
                    title: 'Add board',
                    layout: 'board',
                    error: 'This board is already added'
                });
            } else {
                db.Board.create({
                    board_name: board_name
                }).then(board => {
                    response.render('board', {
                        title: 'Add board',
                        layout: 'board',
                        message: 'Board added'
                    });
                });
            }
        })



    }

}