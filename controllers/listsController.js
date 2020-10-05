const db = require('./../model');

module.exports = {
    getFormList (request, response) {
        response.render('addNewList',{
            title: 'List',
            layout: 'list',
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
            }],
        }).then(list => {
            console.log(JSON.stringify(list, null, ' '))
            response.render('list', {
                title: 'Lists',
                layout: 'list',
                allLists: list
            });
        });
    },

    addList (request, response ){
        const list_name = request.body.listName;

        db.Lists.create({
            list_name: list_name
        }).then(list => {
            response.render('addNewList', {
                title: 'list',
                layout: 'list',
                message: 'List added'
            });
        });

    }
}