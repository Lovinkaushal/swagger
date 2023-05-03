const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(5)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(6).max(8)
        .required(),
    dob: Joi.date().less('now'),
    email: Joi.string()
        .email()
        .lowercase()
        .required(),
    referredby:Joi.string().optional(),
    level:Joi.string().required(),

})

const loginSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(6).max(8)
        .required(),
    email: Joi.string()
        .email()
        .lowercase()
        .required(),
})

const referredSchema = Joi.object({
        referredby: Joi.string()
        .required(),
})

const levelSchema = Joi.object({
    level: Joi.string()
    .required(),
})

const forgotSchema = Joi.object({
    otp: Joi.string()
    .required(),
    email: Joi.string()
    .email()
    .lowercase()
    .required() 
})
const otpSchema = Joi.object({
    otp: Joi.string()
    .required(),
     
})