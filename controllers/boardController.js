const db = require('./../model');

module.exports = {

    getBoards(request, response) {
        db.Board.findAll({
            where: {
                user_id: request.user.id
            }
        }).then(boards => response.json(boards));
    },

    getFormBoard(request, response) {
        response.render('board', {
            title: 'Board',
            layout: 'board',
        })
    },

    getPageBoard(request, response, id) {
        db.Board.findAll({
            where: {
                user_id: id
            },
            attributes: ['id', 'board_name', 'set_list_id']
        }).then(board => {
            response.render('viewYourBoard', {
                title: 'Board',
                layout: 'board',
                listBoard: board
            });
        })
    },

    addBoard(request, response, idUser) {
        const board_name = request.body.boardName;

        db.Board.findOne({
            where: {
                board_name: board_name,
                user_id: idUser
            }
        }).then(board => {
            if (board) {
                response.render('board', {
                    title: 'Add board',
                    layout: 'board',
                    error: 'This board is already added'
                });
            } else {
                db.Set_lists.create({
                    user_id: idUser,
                }).then(result => {
                    db.Board.create({
                        board_name: board_name,
                        user_id: idUser,
                        set_list_id: result.id
                    })
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