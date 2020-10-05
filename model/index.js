const Sequelize = require('sequelize');
const config = require('./../config').db.mysql;

const sequelize = new Sequelize(config.db_name, config.username, config.password, config.options);

const users = require('./users')(Sequelize, sequelize);
const set_lists = require('./set_lists')(Sequelize, sequelize);
const lists = require('./lists')(Sequelize, sequelize);
const comment = require('./comment')(Sequelize, sequelize);
const card = require('./card')(Sequelize, sequelize);
const board = require('./board')(Sequelize, sequelize);

set_lists.belongsTo(users, {foreignKey: 'user_id'});
lists.belongsTo(set_lists, {foreignKey: 'set_list_id'});
board.belongsTo(users, {foreignKey: 'user_id'});
board.belongsTo(set_lists, {foreignKey: 'set_list_id'});
card.belongsTo(board, {foreignKey: 'board_id'});
card.belongsTo(lists, {foreignKey: 'list_id'});
comment.belongsTo(card, {foreignKey: 'card_id'});


set_lists.hasMany(lists, {foreignKey: 'set_list_id'});
card.hasMany(comment, {foreignKey: 'card_id'});
lists.hasMany(card, {foreignKey: 'list_id'});

module.exports = {
    Users: users,
    Set_lists: set_lists,
    Lists: lists,
    Comment: comment,
    Card: card,
    Board: board,

    Sequelize: Sequelize,
    sequelize: sequelize
};

sequelize.sync({force: false})
    //.then(loadData)
    .then(() => console.log('Db has been synchronizing successfully'))
    .catch(err => console.log('Error while synchronizing: ' + err.toString()));

function loadData() {
    return Promise.all([
        users.bulkCreate(require('./data/users.json')),
        set_lists.bulkCreate(require('./data/set_lists.json')),
        lists.bulkCreate(require('./data/lists.json'))
    ])
        .then(() => console.log('Users, Lists and Set lists have been loaded'))
        .then(() => Promise.all([
            board.bulkCreate(require('./data/board.json')),
            card.bulkCreate(require('./data/card.json'))
        ]))
        .then(() => console.log('Board and Card have been loaded'))
        .then(() => Promise.all([
            comment.bulkCreate(require('./data/comment.json'))
        ]))
        .then(() => console.log('Comment has been loaded'));
}
