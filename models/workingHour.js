const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const WorkingHour = sequelize.define('workingHour',{
    serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    dayOfWeek : {
        type:Sequelize.INTEGER,
        allowNull:false,
        validate: {
            min:0,
            max:6,
        },
        comment: '0 for Sunday, 1 for Monday, ..., 6 for Saturday',
    },
    startTime : {
        type: Sequelize.TIME,
        allowNull:false,
    },
    endTime: {
        type: Sequelize.TIME,
        allowNull:false,
    }
});

module.exports = WorkingHour;