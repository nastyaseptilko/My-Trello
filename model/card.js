module.exports = (Sequelize, sequelize) => {
    return sequelize.define('card', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        board_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        list_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        card_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        date_finish_task: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });
};
