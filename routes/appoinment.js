const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const appoinment = require('../controllers/appoinment');

router.post('/new-appoinment' , auth.authenticate , appoinment.postNewAppoinment)
router.post('/working-hours' , auth.authenticate , appoinment.postWorkingHours);

module.exports= router;