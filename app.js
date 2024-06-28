const express = require('express');
const app = express();        
require('dotenv').config();
const path = require('path');
const fs = require('fs');
let cors = require('cors');
const bodyParser = require('body-parser');


app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const serviceRoutes = require('./routes/service')
const appointmentRoutes = require('./routes/appointments')

const User = require('./models/user');
const Service = require('./models/service');
const Appointment = require('./models/appointments');

app.use('/users', userRoutes);
app.use('/services' , serviceRoutes);
app.use('/appointments' , appointmentRoutes);


User.hasMany(Appointment, { as: 'StaffAppointments', foreignKey: 'staffId' });
User.hasMany(Appointment, { as: 'CustomerAppointments', foreignKey: 'customerId' });
Appointment.belongsTo(User, { as: 'staff', foreignKey: 'staffId' });
Appointment.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });

Appointment.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasMany(Appointment, { foreignKey: 'serviceId' });



app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})


sequelize.sync()
    .then(() => {
        console.log('Listening...');
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err))