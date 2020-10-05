const db = require('./../model');

module.exports = {
    getFormCard(request, response) {
        response.render('card', {
            title: 'Card',
            layout: 'card',
        })
    },

    detailsCard(request, response) {
        const id = request.params.id;

        db.Card.findOne({
            where:{
                id:id
            },
            attributes: ['id', 'card_name', 'description', 'date_finish_task']
        }).then(card => {
            response.render('detailsCard', {
                title: 'Details',
                layout: 'card',
                card_name: card.card_name,
                description: card.description,
                date_finish_task: card.date_finish_task,
                id: card.id
            })

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