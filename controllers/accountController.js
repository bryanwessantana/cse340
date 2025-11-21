const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

// Deliver login view
const buildLogin = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
    });
});

// Deliver registration view
const buildRegister = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Register',
        nav,
        errors: null,
    });
});

// Process registration
const registerAccount = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav()
    const { firstName, lastName, email, password } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        req.flash("notice", "Error processing registration.");
        res.status(500).render('account/register', {
            title: 'Register',
            nav: nav,
            errors: null,
        });
        return;
    }

    const regResult = await accountModel.registerAccount(
        firstName,
        lastName,
        email,
        hashedPassword
    );

    if (regResult) {
        req.flash(
            "notice", `Congratulations, you're registered ${firstName}. Please log in.` // FIXED template literal
        )
        res.status(201).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render('account/register', {
            title: 'Register',
            nav,
            errors: null,
            firstName,
            lastName,
            email,
        });
    }
});

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
};