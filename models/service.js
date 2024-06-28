const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Service = sequelize.define('service' , {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },  
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
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    
});

module.exports=Service;