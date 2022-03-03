const {compareFiles} = require('../compareService')

module.exports = async (job, done) => {
  try {
    const matchedData = compareFiles(job.data.originalPath, job.data.comparedPath)
    console.log(`MATCHED DATA ${matchedData}`)
    
    done(null, matchedData);
  } catch (error) {
    done(error);
  }
};
