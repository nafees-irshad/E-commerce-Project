const {check, validationResult} = require('express-validator');

const validationSignUp = [
    check('email')
        .isEmail()
        .withMessage('Please Enter Valid Email Address'),

    check('password')
        .isLength({min:6})
        .withMessage('Password must be at least 6 characters long'),

    check('passwordConfirmation'),
        .isLength({min:6})
        .withMessage('Password must be at least 6 characters long')

    check('name')
        .notEmpty()
        .withMessage('Name is required')

    (req, resp, next)=>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return resp.status(400).json({errors: errors.array() })
        }
        next();
    }
]   