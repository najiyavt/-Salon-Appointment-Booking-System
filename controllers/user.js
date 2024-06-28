const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async ( req , res) => {
    const { username , email  ,password,role } = req.body;
    try{
        const existinEmail = await User.findOne({ where : { email }});
        if(existinEmail){
            res.status(400).json({error: 'Email already exists'});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = User.create({ username , email ,password:hashedPassword ,role});
        res.status(200).json({ newUser, success: true, message: 'New user created' });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Server error while creating new user' })
    }
}

exports.login = async ( req , res) => {
    const  { email , password } = req.body;
    try{ 
        const user = await User.findOne({where:{email}});
        if(!user){
            res.status(404).json({ error: 'User not found!!Please signup' });
        }
        const comparePassword= await bcrypt.compare(password,user.password);
        if(!comparePassword){          
            return res.status(401).json({token, role: user.role, success: false, message: 'User not authorized' });
        }
        //const token = generateToken(user.id, user.username);
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ role:user.role , success: true, message: 'User logged in successfully', token });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Server error while logging ' })
    }
}

// function generateToken(id , name , role){
//     return jwt.sign({userId:id , name:name ,role:role} , process.env.JWT_SECRET);
// }

