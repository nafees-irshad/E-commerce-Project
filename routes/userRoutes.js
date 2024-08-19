const express = require('express');
const router = express.Router();
const checkUserAuth = require('../middleware/authMiddleware')
//Import userModel 
const {userRegistration, userLogin, changePassword, updateUser, loggedUser} = require('../controllers/userController');

//Route level Middleware 
router.use('/change-password', checkUserAuth)
router.use('/update', checkUserAuth)


//Public Routes
router.post('/register', userRegistration);
router.post('/login', userLogin);

//Protected Routes 
router.post('/change-password', changePassword)
router.put('/update', updateUser)
router.get('/logged-user', loggedUser)




module.exports = router;