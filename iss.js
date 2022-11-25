const request = require('request');


const fetchMyIP = function(callback) {
  const address = 'https://api.ipify.org/?format=json';

  request(address,(error,response,body) => {
    
    if (error) return callback(`Error: ${error}`, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;

    return callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const address = `http://ipwho.is/${ip}`;

  request(address, (error, response, body) => {

    if (error) return callback(`Error: ${error}`, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching coordinates: ${body}`), null);
      return;
    }

    const data = JSON.parse(body);

    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }

    const { latitude, longitude } = data;

    return callback(null,{ latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const address = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(address, (error, response, body) => {

    if (error) return callback(`Error: ${error}`, null);

    if (body === 'invalid coordinates') return callback(`Error: invalid coordinates`, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const flyOverTimes = JSON.parse(body).response;

    return callback(null,flyOverTimes);

  });
};

const nextISSTimesForMyLocation = callback => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback("It didn't work!" , error);
    }
  
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback("It didn't work!" , error);
      }
    
      fetchISSFlyOverTimes(data, (error, data) => {
        if (error) {
          return callback("It didn't work!" , error);
        }
        
        callback(null,data);

      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };