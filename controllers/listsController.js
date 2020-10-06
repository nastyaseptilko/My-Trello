const db = require('./../model');

module.exports = {

    getLists(request, response) {
        db.Board.findOne({
            where: {
                id: Number(request.params.board_id),
                user_id: request.user.id
            },
            include: [{
                model: db.Set_lists,
                include: [db.Lists]
            }]
        }).then(board => {
            if (board.set_list) {
                response.json(board.set_list.lists);
            } else {
                response.json([]);
            }
        })
    },

    getFormList (request, response) {
        const set_list_id = request.params.set_list_id;

        response.render('addNewList',{
            title: 'List',
            layout: 'list',
            set_list_id: set_list_id
        })
    },

    getPageLists (request, response) {
        const set_list_id =  Number(request.params.set_list_id);
        const board_id = Number(request.params.board_id);

        if (!set_list_id) {
            response.status(404).send();
            return;
        }
        db.Set_lists.findAll({
            where: {
                user_id: request.user.id
            },
            include: [{
                model: db.Lists,
                include: [{
                    model: db.Card,
                    where: {board_id: board_id}
                }]
            }]
        }).then(list => {
            response.render('list', {
                title: 'Lists',
                layout: 'list',
                allLists: list,
                set_list_id: set_list_id
            });
        });
    },

    addList (request, response ){
        const list_name = request.body.listName;
        const set_list_id = request.params.set_list_id;

        db.Lists.create({
            list_name: list_name,
            set_list_id: set_list_id
        }).then(list => {
            response.render('addNewList', {
                title: 'list',
                layout: 'list',
                message: 'List added'
            });
        });

    }
}