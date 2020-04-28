const { check } = require('express-validator');
// const { body } = require('express-validator/check');

exports.createPostValidator = (req, res, next) => {
    // title
    const validation =  [check('title', "Write a title").notEmpty(),
    check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4, max: 150
    }),
    /// body 
    check('body', "Write a body").notEmpty(),
    check('title', 'Body must be between 4 to 2000 characters').isLength({
        min: 4, max: 2000
    })]
    return validation
};



exports.userSignupValidator = (req, res, next) => {
    const validation = [
        // name is not null and between 4-10 characters
        check("name", "Name is required").notEmpty(),
        // email is not null, valid and normalize
        check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 3,
            max: 100
        }),
        // check for password
        check("password", "Password is required").notEmpty(),
        check("password").isLength({min: 6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")
    ]
    return validation
};



exports.passwordResetValidator = (req, res, next) => {
    // check for password
    const validation = [
        check("newPassword", "Password is required").notEmpty(),
        check("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 chars long").matches(/\d/).withMessage("must contain a number").withMessage("Password must contain a number")]
    // proceed to next middleware or ...
    return validation
};
