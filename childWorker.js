const {
  Worker,
  parentPort,
  workerData,
  searchData,
} = require("worker_threads");

const segments = workerData;

const findMatches = (params) => {
  console.log(
    `CHILD WORKER ~~~ LIST DATA - ${params.listData.length} SEGMENT DATA - ${params.segment.length}`
  );
  let matchBackArray = [];
  params.segment.map((matchBackRow) => {
    for (let i = 0; i < params.listData.length; i++) {
      try {
        if (params.listData[i].SoldDateUTC) {
          const date = new Date(params.listData[i].SoldDateUTC);
          params.listData[i].SoldDateUTC = date.toString();
        }
        if (params.listData[i]["Address 1: Street 1"] && matchBackRow.Address) {
          let matchBackLower = matchBackRow.Address.toLowerCase();
          let searchParamsLower =
            params.listData[i]["Address 1: Street 1"].toLowerCase();

          if (matchBackLower === searchParamsLower) {
            matchBackArray.push(params.listData[i]);

            break;
          }
        }
        if (params.listData[i].address) {
          let matchLower = matchBackRow.Address.toLowerCase();
          let listLower = params.listData[i].address.toLowerCase();
          if (matchLower === listLower) {
            matchBackArray.push(params.listData[i]);
            break;
          }
        }
        if (
          params.listData[i].Address &&
          params.listData[i].Address.toLowerCase() ===
            matchBackRow.Address.toLowerCase()
        ) {
          console.log(`MATCH FOUND ${params.listData[i]}`)
          matchBackArray.push(params.listData[i]);
          break;
        }
        if (params.listData[i]["Address 1"] && matchBackRow.Address) {
          let matchLower = matchBackRow.Address.toLowerCase();
          let listLower = params.listData[i]["Address 1"].toLowerCase();

          if (matchLower === listLower) {
            matchBackArray.push(params.listData[i]);
            break;
          }
        }
        if (params.listData[i]["Street 1 (Regarding) (Lead)"]) {
          let matchLower = matchBackRow.Address.toLowerCase();
          let listLower =
            params.listData[i]["Street 1 (Regarding) (Lead)"].toLowerCase();

          if (matchLower === listLower) {
            matchBackArray.push(params.listData[i]);
            break;
          }
        } else {
          continue;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
  console.log(
    `RESULTS FROM CHILD WORKER MATCHBACK ARRAY ~~~~~~~ ${matchBackArray}`
  );
  return matchBackArray;
};

const result = findMatches(segments);

parentPort.postMessage(result);
