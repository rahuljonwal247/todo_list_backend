const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validation");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
    "/register",
    validate([
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ]),
    authController.register
);

router.post(
    "/login",
    validate([
        body("email").isEmail().withMessage("Invalid email"),
        body("password").notEmpty().withMessage("Password is required"),
    ]),
    authController.login
);

module.exports = router;
