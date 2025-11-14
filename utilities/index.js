const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Middleware to wrap async functions for error handling
 * ************************ */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  
  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a>
    </li>`
  })
  
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">' 
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInventoryDetailsHTML = async function (vehicle) {
  let detailHTML
  if (vehicle) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0, // Assume integer price
    }).format(vehicle.inv_price);
    
    const formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    detailHTML = `<div id="inventory-detail-container">
      <div class="image-section">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} ${vehicle.inv_year}">
      </div>
      <div class="details-section">
        <h2 class="detail-price-heading">${vehicle.inv_make} ${vehicle.inv_model} Price</h2>
        <p class="detail-price">${formattedPrice}</p>
        
        <h3 class="detail-info-heading">Vehicle Details</h3>
        <ul class="detail-list">
          <li><strong>Make:</strong> ${vehicle.inv_make}</li>
          <li><strong>Model:</strong> ${vehicle.inv_model}</li>
          <li><strong>Year:</strong> ${vehicle.inv_year}</li>
          <li><strong>Color:</strong> ${vehicle.inv_color}</li>
          <li><strong>Mileage:</strong> ${formattedMiles} miles</li>
        </ul>

        <h3 class="detail-description-heading">Description</h3>
        <p class="detail-description">${vehicle.inv_description}</p>
      </div>
    </div>`;
  } else {
    detailHTML = '<p class="notice">Sorry, no vehicle information could be found.</p>';
  }
  return detailHTML;
}


module.exports = Util