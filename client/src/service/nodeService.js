import axios from "axios";
import * as helpers from "./serviceHelpers";

const compareData = (data) => {
  const config = {
    method: "POST",
    url: `/node-api/compareData`,
    crossdomain: true,
    data,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

const originalData = (data) => {
  const config = {
    method: "POST",
    url: `/node-api/originalData`,
    crossdomain: true,

    data,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

const deleteOriginalFile = (id) => {
  const config = {
    method: "POST",
    url: `/node-api/delete-original`,
    data: { id },
    crossdomain: true,

    headers: { "Content-Type": "application/json" },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

const deleteComparedFile = (id) => {
  const config = {
    method: "POST",
    url: `/node-api/delete-compared`,
    data: { id },
    crossdomain: true,

    headers: { "Content-Type": "application/json" },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

const compareSmallFiles = (originalId, compareId) => {
  const config = {
    method: "POST",
    url: `/node-api/compare-small-files`,
    crossdomain: true,
    data: { originalId, compareId },
    headers: { "Content-Type": "application/json" },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

const compareLargeFiles = (originalId, compareId) => {
  const config = {
    method: "POST",
    url: `/node-api/compare-large-files`,
    crossdomain: true,
    data: { originalId, compareId },
    headers: { "Content-Type": "application/json" },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

const deleteBothFiles = (originalId, compareId) => {
  const config = {
    method: "DELETE",
    url: `/node-api/remove-files`,
    data: { originalId, compareId },
    crossdomain: true,

    headers: { "Content-Type": "application/json" },
  };

  return axios(config)
    .then(helpers.onGlobalSuccess)
    .catch(helpers.onGlobalError);
};

export {
  originalData,
  compareData,
  deleteOriginalFile,
  deleteComparedFile,
  compareSmallFiles,
  deleteBothFiles,
  compareLargeFiles
};
