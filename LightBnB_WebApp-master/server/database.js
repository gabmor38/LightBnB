const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email = $1;`,[email])
  .then((result) => {
    return Promise.resolve(result.rows[0]);
  })
  .catch((err) => {
    return null;
  });
}
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`SELECT * FROM users WHERE id = $1;`,[id])
  .then((result) => {
    console.log(result.rows[0]);
    return Promise.resolve(result.rows[0]);
  })
  .catch((err) => {
    return null;
  });
  // return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
  .then ((result) => {
    return Promise.resolve(result.rows[0]);
  })
  .catch((err) => {
    return null;
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
  .query (`SELECT * FROM reservations WHERE guest_id = $1 LIMIT $2;`, [guest_id, limit])
  .then((result) => {
    return Promise.resolve(result.rows);
  })
  .catch((err) => {
    console.log(err.message);
  });
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
// 

const getAllProperties = (options, limit = 10) => {
   // 1
   const queryParams = [];
   // 2
   let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;
 
   // 3
   if(options.city ||options.owner_id || options.minimum_price_per_night && options.maximum_price_per_night){
    queryString += 'WHERE '
  }

    if(options.city) {
      queryParams.push(`%${options.city}%`);
        queryString += `city LIKE $${queryParams.length}`;
    }
    if(options.owner_id) {
      queryParams.push(`${options.owner_id}`)
        queryString += ` owner_id = $${queryParams.length}`;
      
    }
    if(options.minimum_price_per_night || options.maximum_price_per_night) {
      const minPrice = options.minimum_price_per_night * 100;
      const maxPrice = options.maximum_price_per_night * 100;
      queryParams.push(`${minPrice}`);
      queryString += ` AND cost_per_night >= $${queryParams.length}`;
      queryParams.push(`${maxPrice}`);
      queryString += ` AND cost_per_night <= $${queryParams.length}`;
    }

    if(options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += ` AND rating >= $${queryParams.length}`;
    }
   // 4
   queryParams.push(limit);
   queryString += `
   GROUP BY properties.id
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;
 
   // 5
   console.log(queryString, queryParams);
 
   // 6
   return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
