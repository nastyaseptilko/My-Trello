module.exports = (Sequelize, sequelize) => {
    return sequelize.define('board', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        board_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        set_list_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
};
