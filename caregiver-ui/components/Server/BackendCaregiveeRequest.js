import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";
const sendCaregiveeRequest = (request, accessToken) => {
  axios
    .post(`${baseUrl}/sendcaregiveerequest`, request, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateCaregiveeRequest = (request, accessToken) => {
  axios
    .put(`${baseUrl}/updatecaregiveerequest`, request, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getCaregiveeRequests= (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregiveerequestssent`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("caregivee requests loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregivee requests: " + error);
      return null;
    });
};

const getCaregiveeRequestsByCaregivee = (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregiveerequestsbycaregivee`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("caregivee requests loaded successfully: " + response);
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregivee requests: " + error);
      return null;
    });
};

export { getCaregiveeRequests, sendCaregiveeRequest, getCaregiveeRequestsByCaregivee, updateCaregiveeRequest };


