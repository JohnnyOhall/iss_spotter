const {nextISSTimesForMyLocation} = require('./iss_promised');
const log = console.log;

const printPassTimes = passTimes => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    log("It didn't work: ", error.message);
  });
