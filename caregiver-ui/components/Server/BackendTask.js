import axios from "axios";

import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";
const createTask = (task, accessToken) => {
  return axios
    .post(`${baseUrl}/taskcreation`, task, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json", 
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("success" + response);
    })
    .catch((error) => {
      console.log("error" + error);
    });
};

const updateTask = (task, accessToken) => {
  return axios
    .put(`${baseUrl}/edittask`, task, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("success" + response);
      return true;
    })
    .catch((error) => {
      console.log("error" + error);
      return false;
    });
};

const deleteTask = (task, accessToken) => {
  return axios
    .delete(`${baseUrl}/deletetask?id=${task.id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("success" + response);
    })
    .catch((error) => {
      console.log("error" + error);
    });
};

const getTasks= (accessToken) => {
  return axios
    .get(`${baseUrl}/gettasks`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("tasks loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading tasks: " + error);
      return null;
    });
};

export { getTasks , createTask, updateTask, deleteTask };


