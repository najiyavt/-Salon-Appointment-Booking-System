const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Service = sequelize.define('service' , {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
});

module.exports=Service;