const Service = require('../models/service');

exports.getAllServices = async( req, res) => {
    try{
        const services = await Service.findAll();
        console.log('services',services)
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch services.' });
  }
}

exports.postNewService = async ( req ,res) => {
    const  { name , description ,duration , price } = req.body;
    try{
        const newService = await Service.create({ name ,  description ,duration , price});
        console.log(' new services' , newService);
        res.status(201).json(newService)
    } catch (error) {
        res.status(500).json({ message: 'Failed to create service.' });
    }
}

// exports.bookAppoinment = async ( req , res ) => {
//     try {
         
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to book appointment.' });
//     }
// }