const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {

    // we can access token from body / cookie-parser / header


    const { token } = req.body;

    //validatin the token
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "missing token",
      });
    }

    //verify the token
    try {
      let payload = jwt.verify(token, process.env.SECRET_KEY);
      console.log("token-payload", payload);

      req.user = payload;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "invalid token",
      });
    }

    // execuiting the next function
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to authenticate",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(500).json({
        success: false,
        message: "not accessed, this is a protected route for admin.",
      });
    }

    // executing the next function
    next();
  } catch (err) {
    return res.status(500).json({
        success : false,
        message : 'use role is not matching.'
    })
  }
};

exports.isStudent = async (req, res, next) => {
    try{
        if (req.user.role !== "student") {
            return res.status(401).json({
              success: false,
              message: "cannt access, this is a protected route for student.",
            });
          }
        
          //executing the next function
          next();
    }catch(err) {
        return res.status(500).json({
            success : false,
            message : 'user role not matched.'
        })
    }
  
};
