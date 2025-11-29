// utilities/authorization.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * optionalJWT
 * - Se houver token no cookie/Authorization, valida e popula res.locals.accountData/res.locals.loggedIn.
 * - Caso não haja token ou seja inválido, não interrompe fluxo (útil para páginas públicas).
 */
function optionalJWT(req, res, next) {
  try {
    const token = (req.cookies && req.cookies.jwt) ||
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      res.locals.accountData = null;
      res.locals.loggedIn = false;
      return next();
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = payload;
    res.locals.loggedIn = true;
    return next();
  } catch (err) {
    res.clearCookie('jwt');
    res.locals.accountData = null;
    res.locals.loggedIn = false;
    return next();
  }
}

/**
 * checkJWT
 * - Exige que o usuário esteja autenticado (token válido).
 * - Em falha: redireciona para /account/login com mensagem.
 */
function checkJWT(req, res, next) {
  try {
    const token = (req.cookies && req.cookies.jwt) ||
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      req.flash('error', 'You must be logged in to access that resource.');
      return res.redirect('/account/login');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = payload;
    res.locals.loggedIn = true;
    return next();
  } catch (err) {
    res.clearCookie('jwt');
    req.flash('error', 'Your session has expired or is invalid. Please log in again.');
    return res.redirect('/account/login');
  }
}

/**
 * checkInventoryPermissions
 * - Usar nas rotas administrativas (add/edit/delete inventory/classifications).
 * - Permite acesso apenas se account_type for "Employee" ou "Admin".
 * - Em falha: entrega a view de login com mensagem (conforme Task 2).
 *
 * IMPORTANT: This middleware should NOT be used for classification or detail views
 * intended for public visitors.
 */
function checkInventoryPermissions(req, res, next) {
  try {
    const token = (req.cookies && req.cookies.jwt) ||
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      req.flash('error', 'You must be logged in to access inventory management.');
      return res.redirect('/account/login');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = payload;
    res.locals.loggedIn = true;

    const at = (payload.account_type || '').toLowerCase();
    if (at === 'employee' || at === 'admin') {
      return next();
    } else {
      req.flash('error', 'You do not have sufficient privileges to access inventory management.');
      return res.redirect('/account/login');
    }
  } catch (err) {
    res.clearCookie('jwt');
    req.flash('error', 'Your session has expired or is invalid. Please log in again.');
    return res.redirect('/account/login');
  }
}

module.exports = {
  optionalJWT,
  checkJWT,
  checkInventoryPermissions
};
