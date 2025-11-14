/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const inventoryRoute = require("./routes/inventoryRoute")
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const Util = require("./utilities/") // Import utilities for custom error handler

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)

// Index route
app.get("/", baseController.buildHome)

// Handle 404 errors (Must be placed after all routes)
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we could not find that route.'})
})

/* ***********************
 * Express Error Handler (Task 2)
 * Custom Error Middleware
 * ************************/
app.use(async (err, req, res, next) => {
  // Certifique-se de que a navegação é construída para a view de erro
  let nav = await Util.getNav() 
  console.error(`Error Handler: ${err.message}`)
  
  // Define status padrão 500 se não for fornecido
  let status = err.status || 500 
  let message = err.message || 'Oh no! There was a crash. Maybe try a different route?'

  // Tratamento específico para 404
  if (status === 404) {
    message = err.message || 'Sorry, we could not find that route.'
  }

  res.status(status).render("errors/error", {
    title: status === 404 ? "404 Not Found" : "Server Error",
    message: message,
    nav,
    status: status
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})