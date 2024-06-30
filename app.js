const express = require('express');
const app = express();        
require('dotenv').config();
const path = require('path');
const http = require('http');
const cors = require('cors')
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const sequelize = require('./util/database');
const server = http.createServer(app);
const io = socketIo(server, { 
    cors: { origin: "*",} 
});
app.use(cors({ origin: '*' , credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const userRoutes = require('./routes/user');
const serviceRoutes = require('./routes/service')
const appointmentRoutes = require('./routes/appointments')(io);

const User = require('./models/user');
const Service = require('./models/service');
const Appointment = require('./models/appointments');

app.use('/users', userRoutes);
app.use('/services' , serviceRoutes);
app.use('/appointments' , appointmentRoutes);

require('./cronJob/cron');

User.hasMany(Appointment, { as: 'StaffAppointments', foreignKey: 'staffId' });
User.hasMany(Appointment, { as: 'CustomerAppointments', foreignKey: 'customerId' });
Appointment.belongsTo(User, { as: 'staff', foreignKey: 'staffId' });
Appointment.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });

Appointment.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasMany(Appointment, { foreignKey: 'serviceId' });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


sequelize.sync()
.then(() => {
    console.log('Database synchronized');
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server listening on port ${process.env.PORT || 3000}`);
    });
})
.catch(err => console.error('Failed to sync database:', err));