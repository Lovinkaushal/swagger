const bcrypt = require("bcrypt");
const userSchema = require("../Schemas/userSchema");
const { registerSchema, loginSchema, referredSchema, levelSchema, forgotSchema,otpSchema} = require("../validations/user.validations");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')

module.exports.register = async ({ name, email, password, dob, referredby, level }) => {
    try {
        let { error, value } = registerSchema.validate({ name, email, password, dob, referredby, level });
        if (error) {
            throw new Error(error.message);
        }
        value.password = await bcrypt.hash(value.password, 10);
        let user = await userSchema.create({
            ...value
        });
        return {
            message: 'success',
            status: 201,
            user
        }
    } catch (error) {
        throw error;
    }
}

module.exports.login = async ({ email, password }) => {
    try {

        let { error, value } = loginSchema.validate({ email, password });
        if (error) {
            throw new Error(error.message);
        }
        let user = await userSchema.findOne({ email: value.email });
        if (!user) {
            throw new Error('user doesn`t exist');
        }
        let correct = await bcrypt.compare(value.password, user.password);
        if (!correct) {
            throw new Error("password doesn't match");
        }
        if (correct) {
            let token = jwt.sign({ _id: user._id },
                'dummy text',
                {
                    expiresIn: "24h"
                }
            )
        }

        user = user.toObject();
        delete user.password;
        return {
            message: 'success',
            status: 200,
            user,
            token: token
        }
    } catch (error) {
        throw error;
    }
}

module.exports.forgotPass = async ({ email, otp }) => {
    try {
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        console.log(otp, email, "otpp,email")
        let { error, value } = forgotSchema.validate({ otp, email });
        if (error) {
            throw new Error(error.message);
        };
        let user = await userSchema.findOne({ email });
        console.log(user, "findd")

        if (!user) {
            throw new Error("user not exist")
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 3000,
            secure: true,
            auth: {
                user: 'cbllovinkaushal@gmail.com',
                pass: 'uqqxzrlbtozhrsmf'
            },
        });
        let mailOptions = await transporter.sendMail({
            from: 'cbllovinkaushal@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: otp
        });

        let otpsave = await userSchema.findByIdAndUpdate(user._id, { $set: { otp: otp } }, { new: true });
        let token = jwt.sign({
            _id: user._id
        },
            'dummy text',
            {
                expiresIn: "2h"
            }
        );

        console.log(otpsave, 'otpdone')
        console.log('Email sent: ' + mailOptions.response);
        return {
            message: 'success',
            status: 200,
            token: token
        }

    } catch (error) {
        throw error;
    }
}

module.exports.otpMatch = async ({ otp })  => {
    let { error, value } = otpSchema.validate({  otp });
    if (error) {
        throw new Error(error.message);
    }
    try {
        let user = await userSchema.findOne({ otp: otp });
        if (!user) {
            throw new Error('user doesn`t exist');
        }
        return {
            message: 'success',
            status: 200,
            user
        }
    } catch (error) {
        throw error;
    }
}

module.exports.referred = async ({ referredby }) => {
    try {
        let { error, value } = referredSchema.validate({ referredby });
        if (error) {
            throw new Error(error.message);
        }
        let user = await userSchema.find({ referredby: referredby });
        console.log(user);
        if (!user) {
            throw new Error('Incorrect Referrence Id');
        }
        if (user) {
            var token = jwt.sign({
                referredby: user.referredby
            },
                'dummy text',
                {
                    expiresIn: "24"
                }
            )
        }

        //user = user.toObject();
        delete user.password;
        return {
            message: 'success',
            status: 200,
            user,
            token: token
        }
    } catch (error) {
        throw error;
    }
}

module.exports.level = async ({ level }) => {
    try {

        let { error, value } = levelSchema.validate({ level });
        if (error) {
            throw new Error(error.message);
        }
        let user = await userSchema.find({ level: level })
        console.log(user);
        if (!user) {
            throw new Error('Incorrect level Number');
        }
        if (user) {
            var token = jwt.sign({
                level: user.level
            },
                'dummy text',
                {
                    expiresIn: "24"
                }
            )
        }

        // user = user.toObject();
        delete user.password;
        return {
            message: 'success',
            status: 200,
            user,
            token: token
        }
    } catch (error) {
        throw error;
    }
}