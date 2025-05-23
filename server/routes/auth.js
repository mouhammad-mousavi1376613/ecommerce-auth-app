// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const authMiddleware = require('../middleware/auth.js');
// const router = express.Router();

// const users = [];

// //register router
// router.post('/register', async (req, res)=>{
//     try {
//         const {username, password} = req.body;
        
//         const existingUser = users.find(user => user.username === username);
//         if(existingUser) return res.status(400).json({message: 'user already exists'});

//         const hashedpassword = await bcrypt.hash(password, 10);
//         users.push({username, password: hashedpassword});

//         res.status(201).json({message: "User registered successfully"});
//     } catch (error) {
//         res.status(400).json({message: error.message + "user "});
//     }
// });

// //login router
// router.post('/login', async (req, res)=>{
//     try {
//         const {username, password} = req.body;
        
//         const user = users.find(u => u.username === username); 
//         if(!user) return res.status(400).json({message: "Invalid credentials"});

//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

//         const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: "1h"});
//         res.json({token});
//     } catch (error) {
//         res.status(400).json({message: error.message + "user "});
//     }
// });

// router.get('/me', authMiddleware , (req, res)=>{
//     res.json({message: `Hello ${req.user.username}`});
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.protect, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;