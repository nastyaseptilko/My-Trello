const db = require('./../model');

module.exports = {
    async getSearch(request, response) {
        const search = request.query.search;

        let boards = await db.Board.findAll({
            where: {
                board_name: {
                    [db.Op.like]: `%${search}%`
                }
            },
            attributes: ['id', 'board_name', 'set_list_id']
        });

        let cards = await db.Card.findAll({
            where: {
                card_name: {
                    [db.Op.like]: `%${search}%`
                }
            },
            attributes: ['id', 'card_name']
        });

        let result = boards.concat(cards);

        response.json(result);
    }
}