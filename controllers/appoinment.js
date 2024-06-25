const { where } = require('sequelize');
const Appoinment = require('../models/appoinment');
const WorkingHour = require('../models/workingHour');

exports.postNewAppoinment = async ( req , res ) => {
    const { serviceId , dateTime } = req.body;
    userId = req.user.id;
    try {
        const newAppoinment = await Appoinment.create({ serviceId , userId , dateTime });
        console.log('New appoinment' , newAppoinment);
        res.status(201).json(newAppoinment)
    } catch (error) {
        res.status(500).json({ message: 'Failed to book appointment.' });
    }
}

exports.postWorkingHours = async ( req , res ) => {
    const {  dayOfWeek, startTime, endTime } = req.body;
    try {
        const existingWorkingHour = await WorkingHour.findOne({ where : { dayOfWeek}});
        if(existingWorkingHour){
            await existingWorkingHour.update({startTime , endTime });
            console.log('exisiting working hour' , existingWorkingHour)
            res.json(existingWorkingHour);
        }else{
            const newWorkingHour = await WorkingHour.create({ dayOfWeek , startTime , endTime});
            console.log('new working hour' , newWorkingHour)
            res.status(201).json(newWorkingHour);
        }
    } catch (error) {
        console.error('Failed to update working hours:', error);
        res.status(500).json({ message: 'Failed to update working hours.' });    }
}


exports.postServiceAvaialability = async ( req , res ) => {
    const { serviceId, dayOfWeek, startTime, endTime } = req.body;
    try {
         const exisingAvaialability = await WorkingHour.findOne({ where : { serviceId , dayOfWeek}});
         if(exisingAvaialability){
            await exisingAvaialability.update({ startTime , endTime});
            res.json(exisingAvaialability);
         }else{
            const newAvailability = await WorkingHour.create({ serviceId , dayOfWeek});
            res.status(201).json(newAvailability)
         }
    } catch (error) {
        console.error('Failed to set service availability:', error);
        res.status(500).json({ message: 'Failed to set service availability.' });    }
}