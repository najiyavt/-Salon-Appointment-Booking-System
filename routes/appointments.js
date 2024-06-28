const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const appointment = require('../controllers/appointments');

router.post('/book-appointment' , auth.authenticate , appointment.bookAppointment);
router.get('/user-appointment' , auth.authenticate , appointment.getUserAppointments);
router.get('/get-all-appointments' , auth.authenticate , auth.isStaff,appointment.getAllAppointments);
router.put('/cancel-appointment/:id' , auth.authenticate  ,appointment.cancelAppointment);


module.exports= router;