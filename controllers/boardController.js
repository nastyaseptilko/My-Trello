const db = require('./../model');

module.exports = {
    getPageAddBoard (request, response) {
        response.render('board',{
            title: 'Board',
            layout: 'board',
        })
    },

    getPageBoard (request, response, id) {
        db.Board.findAll({
            where: {
                user_id: id
            },
            attributes:['board_name', 'set_list_id']
        }).then(board=> {
            response.render('viewYourBoard', {
                title: 'Board',
                layout: 'board',
                listBoard: board
            });
        })
    },

    getPageLists (request, response) {
       const set_list_id =  Number(request.params.set_list_id);
        if (!set_list_id) {
            response.status(404).end();
            return;
        }
        db.Set_lists.findAll({
            where: {
                user_id: request.user.id
            },
            include: [db.Lists],

        }).then(list => {
            response.render('list', {
                title: 'Lists',
                layout: 'list',
                allLists: list
            });
        });
    },
    //response.end(JSON.stringify(set, null, '  '))

    addBoard (request, response, id) {
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
                    board_name: board_name,
                    user_id: id
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