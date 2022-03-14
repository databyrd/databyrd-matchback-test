const express = require("express");
const router = express.Router();
const fs = require("fs");
var XLSX = require("xlsx");
const multer = require("multer");
const { match } = require("../queues");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "files");
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/node-api/ping", function (req, res, next) {
  res.json(`ping working on PORT ${process.env.PORT}`);
});

router.post(
  "/node-api/compareData",
  upload.single("file"),
  async function (req, res, next) {
    res.json(req.file);
  }
);

router.post(
  "/node-api/originalData",
  upload.single("file"),
  async function (req, res, next) {
    res.json(req.file);
  }
);

router.post("/node-api/delete-original", async function (req, res, next) {
  const id = req.body.id;
  try {
    fs.unlinkSync(id);

    res.send(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/node-api/delete-compared", async function (req, res, next) {
  const id = req.body.id;

  try {
    fs.unlinkSync(id);

    res.send(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/node-api/remove-files", async function (req, res, next) {
  try {
    fs.unlinkSync(req.body.originalId);
    fs.unlinkSync(req.body.compareId);

    res.send("200OK");
  } catch (error) {
    console.log(error);
  }
});

router.post("/node-api/compare-small-files", async function (req, res, next) {
  const originalPath = req.body.originalId;
  const comparedPath = req.body.compareId;

  const originalWorkbook = XLSX.readFile(originalPath);
  const sheet_name_list_1 = originalWorkbook.SheetNames;
  const originalData = XLSX.utils.sheet_to_json(
    originalWorkbook.Sheets[sheet_name_list_1[0]]
  );
  const comparedWorkbook = XLSX.readFile(comparedPath);
  const sheet_name_list_2 = comparedWorkbook.SheetNames;
  const comparedData = XLSX.utils.sheet_to_json(
    comparedWorkbook.Sheets[sheet_name_list_2[0]]
  );

  res.json({ originalData, comparedData });
});

const jobOptions = {
  attempts: 3,
};

router.post("/node-api/compare-large-files", async function (req, res, next) {
  const originalPath = req.body.originalId;
  const comparedPath = req.body.compareId;
  const originalHeader = req.body.originalHeader;
  const comparedHeader = req.body.comparedHeader;
  console.log(
    `COMPARE LARGE FILES ~~~ ${originalPath} ~~~ ${comparedPath} ~~~ ${originalHeader} ~~~ ${comparedHeader}`
  );

  try {
    const jobData = await match.add(
      {
        originalPath,
        comparedPath,
        originalHeader,
        comparedHeader,
      },
      jobOptions
    );
    console.log(`JOB DATA ID NUMBER ~~~ ${jobData.status}`);
    console.log("COMPLETE", jobData.id);
    res.send(jobData.id);
  } catch (error) {
    console.log(error);
  }
});

router.get("/node-api/job-status/:jobId", async function (req, res, next) {
  const jobId = req.params.jobId;
  try {
    const results = await match.getJob(jobId);

    if (results.id) {
      res.json(results);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
