const Service = require('../models/service');
const User = require('../models/user');

exports.getAllServices = async( req, res) => {
    try{
        const services = await Service.findAll();
        console.log('services',services)
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message, message: 'Failed to fetch services.' });
  }
}

exports.createServices = async ( req ,res) => {
    const  { name , description ,duration , price } = req.body;
    try{
        const newService = await Service.create({ name , description ,duration , price });
        console.log(' new services' , newService);
        res.status(201).json(newService)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message,message: 'Failed to create service.' });
    }
}

exports.getStaff = async(req,res) => {
    try{
        const staffs = await User.findAll({ where: { role: 'staff' } });
        console.log(' staffs of salon' , staffs);
        res.status(200).json({staffs,message:'the staffs of the salon'});
    } catch (error) {
        console.error(error,'cannot fetch staffs');
        res.status(500).json({ error: error.message,message: 'Failed to fetch staffs.' });
    }
}