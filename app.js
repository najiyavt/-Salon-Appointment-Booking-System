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
const appoinmentRoutes = require('./routes/appoinment')

const User = require('./models/user');

app.use('/user', userRoutes);
app.use('/service' , serviceRoutes);
app.use('/appoinment' , appoinmentRoutes);


app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})


sequelize.sync({})
    .then(() => {
        console.log('Listening...');
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err))