const db = require('./../model');

module.exports = {
    getFormCard (request, response) {
        response.render('card',{
            title: 'Card',
            layout: 'card',
        })
    },

    addCard(request, response) {
        const board_id = request.body.boardId;
        const list_id = request.body.listId;
        const card_name = request.body.cardName;
        const description = request.body.description;
        const date_finish_task = request.body.date;

        db.Card.create({
            board_id: board_id,
            list_id: list_id,
            card_name: card_name,
            description: description,
            date_finish_task: date_finish_task
        }).then(card => {
            response.render('card', {
                title: 'Add card',
                layout: 'card',
                message: 'Card added'
            });
        });
    }
}