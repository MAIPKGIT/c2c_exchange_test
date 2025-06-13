const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('c2c_exchange', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;