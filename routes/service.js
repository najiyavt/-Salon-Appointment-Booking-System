const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const service = require('../controllers/service');

router.get('/get-service' , auth.authenticate , service.getAllServices);
router.post('/service-creation' , auth.authenticate ,auth.isStaff,service.createServices);

module.exports= router;