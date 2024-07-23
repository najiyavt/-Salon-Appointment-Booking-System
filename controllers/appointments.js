const { where } = require('sequelize');
const  Appointment = require('../models/appointments');
const  User = require('../models/user');
const  Service = require('../models/service');
const Razorpay = require('razorpay');


exports.bookAppointment = (io) => async ( req , res ) => {
    const { dateTime , serviceId ,staffId } = req.body;
    try {
        const newAppointment = await Appointment.create({  
            dateTime,
            status: 'Scheduled',
            customerId: req.user.id,
            serviceId,
            staffId
        });
        io.emit('newAppointment', newAppointment);
        res.status(201).json(newAppointment)
    } catch (error) {
        console.error('Failed to book appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });

    }
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.appointmentPayment = async (req, res) => {
    const {amount , currency , receipt } = req.body;
    try {
        const options = {
            amount: amount ,
            currency,
            receipt,
        };
        console.log('options' , options);
        const order = await razorpay.orders.create(options);
        console.log('orrder' , order);
        res.status(200).json({order,key_id: razorpay.key_id });
    } catch (error) {
        console.error('Error in payment:', error);
        res.status(500).json({ message: 'Something went wrong in payment', error: error });
    }
};


exports.getAllAppointments = async ( req , res ) => {
    try{
        const appointments = await Appointment.findAll({
            include: [
                { model: Service, attributes: ['name']  },
                {  model: User, as: 'customer',attributes: ['username']},
                { model: User, as: 'staff', attributes: ['username'] }
            ]
        });
        res.json(appointments);
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
            include: [
                {
                    model: Service,
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'staff',
                    attributes: ['username']
                }
            ]
        });
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
        appointment.status = 'Canceled';
        await appointment.save();
        res.json(appointment);
    } catch(error){
        console.error(error);
        res.status(500).json({message:'error cancelling appoinments', error: error.message });
    }
};
