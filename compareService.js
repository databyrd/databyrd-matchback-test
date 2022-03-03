const fs = require("fs");
const os = require("os");
var XLSX = require("xlsx");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");

const workerPath = path.resolve("childWorker.js");

const userCPUCount = os.cpus().length;

process.on("message", async (message) => {
  const response = await compareFiles(message.fPath1, message.fPath2);

  process.send(response);
  process.exit();
});

async function compareFiles(fPath1, fPath2) {
  const originalWorkbook = XLSX.readFile(fPath1);
  const sheet_name_list_1 = originalWorkbook.SheetNames;
  const listData = XLSX.utils.sheet_to_json(
    originalWorkbook.Sheets[sheet_name_list_1[0]]
  );

  const comparedWorkbook = XLSX.readFile(fPath2);
  const sheet_name_list_2 = comparedWorkbook.SheetNames;
  const matchBackData = XLSX.utils.sheet_to_json(
    comparedWorkbook.Sheets[sheet_name_list_2[0]]
  );
  // -------- SEPARATE THE LARGE ARRAY INTO SMALLER ARRAYS DEPENDING ON THE
  // NUMBER OF USER CPUS ARE AVAILABLE
  console.log(`NUMBER OF USER CPU ~~~ ${userCPUCount}`);
  const segmentSize = Math.floor(matchBackData.length / userCPUCount);
  console.log(`SEGMENT SIZE ~~~ ${segmentSize}`);
  const segments = [];

  for (let segmentIndex = 0; segmentIndex < userCPUCount; segmentIndex++) {
    const start = segmentIndex * segmentSize;
    const end = start + segmentSize;
    const segment = matchBackData.slice(start, end);
    segments.push(segment);
  }

  const results = await Promise.all(
    segments.map(
      (segment) =>
        new Promise((resolve, reject) => {
          const worker = new Worker("./childWorker.js", {
            workerData: { segment, listData },
          });
          worker.on("message", resolve);
          worker.on("error", reject);
          worker.on("exit", (code) => {
            if (code !== 0)
              reject(new Error(`Worker stopped with exit code ${code}`));
          });
        })
    )
  );
  console.log(`RESULTS FROM PROMISE COMPLETE ~~~~~~~ ${results.length}`);
  return results;
}
