const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Appointment = require('../models/appointments'); 
const User = require('../models/user'); 
const Service = require('../models/service'); 
const { Op } = require('sequelize');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Send appointment reminders at 09:00 AM Asia/Kolkata timezone
cron.schedule('0 9 * * *' , async () => {
    console.log('Running a job at 09:00 at Asia/Kolkata timezone');
    await sendAppointmentReminders();
},{
    timezone: "Asia/Kolkata"
});

// Archive appointments older than 2 days at midnight Asia/Kolkata timezone
cron.schedule('0 0 * * *', async () => {
    console.log('Running a job at midnight to archive old appointments');
    await archiveOldAppointments();
}, {
    timezone: "Asia/Kolkata"
});

async function sendAppointmentReminders(){
    try{
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.findAll({
            where:{
                dateTime: {
                    [Op.between] : [new Date() , tomorrow ]
                },
                status:'scheduled'
            },
            include: [
                {model: User , as :'customer' , attributes:['email' , 'username']},
                {model:Service , attributes:['name']}
            ]
        });
        appointments.forEach(appointment => {
            const { customer , service , dateTime } = appointment;
            sendEmailReminder(customer.email, customer.username, service.name, dateTime);
        });
    }catch (error) {
        console.error('Error sending appointment reminders:', error);
    }
};

async function sendEmailReminder(email, username, serviceName, dateTime){
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to:email,
        subject:'Appointment Reminder',
        text: `Dear ${username},\n\nThis is a reminder for your upcoming appointment for ${serviceName} on ${new Date(dateTime).toLocaleString()}.\n\nThank you,\nYour Salon`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    })
};

async function archiveOldAppointments(){
    try{
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() -2);

        const result = await Appointment.update(
            { status: 'archived' },
            {where: {
                    dateTime: { [Op.lt]: twoDaysAgo},
                    status: 'scheduled'
                }
            }
        );
        console.log(`Archived ${result[0]} appointments`);
    }catch (error) {
        console.error('Error archiving old appointments:', error);
    }
}