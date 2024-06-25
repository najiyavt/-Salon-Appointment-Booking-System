const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Appoinment = sequelize.define('appoinment' , {
    serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    dateTime : {
        type:Sequelize.DATE,
        allowNull:false
    }
});

module.exports=Appoinment;