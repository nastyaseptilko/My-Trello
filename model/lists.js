module.exports = (Sequelize, sequelize) => {
    return sequelize.define('lists', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        list_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        set_list_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
};
