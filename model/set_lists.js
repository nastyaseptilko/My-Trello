module.exports = (Sequelize, sequelize) => {
    return sequelize.define('set_lists', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        user_id:{
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
};
