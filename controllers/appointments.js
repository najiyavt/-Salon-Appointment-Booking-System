const { where } = require('sequelize');
const Appointment = require('../models/appointments');
const Service = require('../models/service');
const User = require('../models/user');

exports.bookAppointment = async ( req , res ) => {
    const { dateTime , serviceId } = req.body;
    const userId = req.user.id;
    try {
        const newAppointment = await Appointment.create({  
            dateTime,
            status: 'scheduled',
            customerId: userId,
            serviceId,
        });
        console.log('New appoinment' , newAppointment);
        res.status(201).json(newAppointment)
    } catch (error) {
        console.error('Failed to book appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });

    }
}


exports.getAllAppointments = async ( req , res ) => {
    try{
        const appoinments = await Appointment.findAll({
            include: [
                {
                    model:Service,
                    attributes:['name']
                },
                {
                    model:User,
                    as:'staff',
                    attributes:['username']
                },
                {
                    model:User,
                    as:'customer',
                    attributes:['username']
                }
            ]
        });
        console.log('Staff appoinments' , appoinments);
        res.json(appoinments);
    } catch (error) {
        console.error('Failed to fetch staff appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
}

exports.getUserAppointments = async( req ,res) => {
    const userId = req.user.id;
    try{
        const appoinments = await Appointment.findAll({
            where: { customerId : userId},
            include : [
                {
                    model:Service,
                    attributes:['name']
                },
                {
                    model:User,
                    as:'staff',
                    attributes:['username']
                }
            ]
        });
        console.log('User appoinments' , appoinments);
        res.json(appoinments);
    } catch(error){
        console.error('Failed to fetch user appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
}


exports.cancelAppointment = async(req, res) => {
    const id = req.params.id;
    try{
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointments not found' });
        };
        appointment.status = 'canceled';
        await Appointment.save();
        console.log('calncel appointments' , appointment);
        res.json(appointment);
    } catch(error){
        console.error(error);
        res.status(500).json({message:'error cancelling appoinments', error: error.message });
    }
}
