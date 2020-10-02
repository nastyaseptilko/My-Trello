module.exports = (Sequelize, sequelize) => {
    return sequelize.define('comment', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        body_comment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        card_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
};
