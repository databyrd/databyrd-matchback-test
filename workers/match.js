const {compareFiles} = require('../compareService')

module.exports = async (job, done) => {
  try {
    console.log(`MATCHED DATA START`)
    const matchedData = compareFiles(job.data.originalPath, job.data.comparedPath)
    console.log(`MATCHED DATA END${matchedData}`)
    
    done(null, matchedData);
  } catch (error) {
    done(error);
  }
};
