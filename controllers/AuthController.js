const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.signup = async( req, res) => {
    try{
        const {name, email, password, role} = req.body;

        if(!name || !email || !password || !role) {
            return res.status(400).json({
                success : false,
                message : 'all fields are required'
            })
        }

        // checking user if already registerd with the emailid
        const existingUser = await User.findOne({email});
        
        if(existingUser) {
            return res.status(401).json({
                success : false,
                message : 'this account is already registered.'
            })
        }

        // hash the password to save in the database 
        let hashedPassword ;

        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }catch(err) {
            return res.status(500).json({
                success : false,
                message : 'failed to hash password, please try again.'
            })
        }

        // save the user data in the database
        const createUser = await User.create({name, email, role, password: hashedPassword});
        
        if(!createUser) {
            return res.status(500).json({
                success : false,
                message : 'failed to create user in database, please try again.'
            })
        }

        return res.status(200).json({
            success: true,
            message : 'user created successfully',
            data : createUser
        })
        

    }catch(err) {
        // error if unable to create the user in the database or any other error if occured
        console.log("error in creating user", err);
        return res.status(500).json({
            success : false,
            message : 'failed to create user, please try again.'
        })
    }
}

exports.login = async (req , res) => {
    try{
        // fetching data from the request body
        const {email, password} = req.body;

        // validating the email and password
        if(!email && !password) {
            return res.status(400).json({
                success : false,
                message : 'all fields are required'
            })
        }
        // if only email field is empty
        if(!email) {
            return res.status(400).json({
                success : false,
                message : 'email id is required.'
            })
        }

        // if only password filed is empty
        if(!password) {
            return res.status(400).json({
                success : false,
                message : 'password is required.'
            })
        }

        // checking if the user is already registerd
        const user = await User.findOne({email});

        // if user is not registerd
        if(!user) {
            return res.status(401).json({
                success : false,
                message  : 'user is not registered, please signup first.'
            })
        }

        // now match  the password 
        const passMatch = await bcrypt.compare(password, user.password);
 
        if(!passMatch) {
            return res.status(401).json({
                success : false,
                messag  :'password is wrong, please try again.'
            })
        }

        user.password = undefined;

        // creating the json web token
        let token;

        // payload to send in the jwt token , we can use this payload for the authentication and authorization of the use
        const payload = {
            name : user.name,
            email : user.email,
            role : user.role
        }
        try{
            token =   jwt.sign(payload,process.env.SECRET_KEY, {expiresIn : 3 * 24 * 60 * 60 *60});
        }catch(err) {
            return res.status(500).json({
                success : false,
                message : 'failed to create json web token, please try again later.'
            })
        }

        // user = user.toObject();
        // user.token = token;
        // const resposeData = {...user, token}

        // const options = {
        //     expires : new Date(Date.now() + )
        // }
 
        

        return res.cookie("token", token).status(200).json({
            success : true,
            message  : 'user logged in successfully.',
            token : token,
            data : user
        })        

    }catch(err) {
        // if unable to let the user logged in
        console.log("err in loggin user", err);
        return res.status(500).json({
            success :  false,
            message : 'failed to logged in , please try again.'
        })
    }
}