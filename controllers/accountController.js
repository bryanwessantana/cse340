const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

const buildLogin = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email: null, 
    });
});

const buildRegister = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Register',
        nav,
        errors: null,
        account_firstname: null,
        account_lastname: null,
        account_email: null,
    });
});

const registerAccount = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav()
    const { 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password 
    } = req.body;

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
        req.flash("notice", "Error processing registration.");
        res.status(500).render('account/register', {
            title: 'Register',
            nav: nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        req.flash(
            "notice", `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
            account_email: account_email,
        });
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render('account/register', {
            title: 'Register',
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        });
    }
});

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
};