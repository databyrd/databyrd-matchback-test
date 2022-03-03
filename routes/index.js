const express = require("express");
const router = express.Router();
const fs = require("fs");
var XLSX = require("xlsx");
const multer = require("multer");
// const { compareFiles } = require("../services/compareService");
var cp = require('child_process');
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "files");
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});
const upload = multer({ storage });
/* GET home page. */
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

// router.post("/node-api/compare-large-files", async function (req, res, next) {
//   const originalPath = req.body.originalId;
//   const comparedPath = req.body.compareId;
//   const childProcess = cp.fork("../services/compareService.js");
//   childProcess.send({ fPath1: originalPath, fPath2: comparedPath });
//   childProcess.on("message", (response) => res.send(response));

//   // try {
//   //   const matchedData = await compareFiles(originalPath, comparedPath, req);
//   //   res.send(matchedData);
//   // } catch (error) {
//   //   console.log(error);
//   // }
// });

module.exports = router;
