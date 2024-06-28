const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Appointment = sequelize.define('appointment' , {
    
    dateTime : {
        type:Sequelize.DATE,
        allowNull:false
    },
    status:{
        type: Sequelize.ENUM('scheduled', 'completed', 'canceled'),  
        allowNull:false
    }
});

module.exports=Appointment;