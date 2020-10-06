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
            where: {
                id: id
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
    },

    updateCard(request, response) {
        const card_id = request.params.id;
        const card_name = request.body.cardName;
        const description = request.body.descriptionCard;
        const date_finish_task = request.body.dateFinishTaskCard;

        db.Card.update({
            card_name: card_name,
            description: description,
            date_finish_task: date_finish_task },
            {
            where: {
                id: card_id
            }
        }).then(result => response.json(result));
    },

    deleteCard(request, response) {
        const card_id = request.params.id;
        const deleteCard = {  id: card_id }

        return db.Card.destroy({
            where: deleteCard
        }).then(isDeleted => {
            if (isDeleted) {
                response.json(deleteCard);
            } else {
                response.status(401).end('<h1>No such records have been found</h1>')
            }
        });

    }
}
