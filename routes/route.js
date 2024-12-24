const express = require("express");

const router = express.Router();
const {signup, login} = require("../controllers/AuthController")
const {auth, isAdmin, isStudent} = require("../middlewares/auth");

// definen your routes
router.post("/signup",signup );
router.post('/login', login);

// uses of middleware for protected route
router.get("/test", auth, (req, res) => {
    return res.status(200).json({
        success : false,
        message  : 'welcome to the protected route for testing.'
    })
})

router.get("/admin",auth, isAdmin, (req, res) => {
    return req.statusCode(200).json({
        success : true,
        message : 'welcome to admin protected route'
    })
});

router.get("/student", auth, isStudent, (req, res) => {
    return res.status(200).json({
        success : true,
        message : 'welcome to the protected route of student.'
    })
})

module.exports = router;