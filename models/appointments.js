const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Appointment = sequelize.define('appointment' , {
    
    dateTime : {
        type:Sequelize.DATE,
        allowNull:false
    },
    status:{
        type: Sequelize.ENUM('Scheduled', 'Completed', 'Canceled'),  
        allowNull:false
    }
});

module.exports=Appointment;