import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";
const sendCaregiverRequest = (request, accessToken) => {
  axios
    .post(`${baseUrl}/sendcaregiverrequest`, request, {
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

const getCaregiverRequestsSent = (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregiverrequestssent`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("caregiver requests loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregiver requests: " + error);
      return null;
    });
};

const getCaregiveeRequestsSent = (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregiveerequestssent`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("caregiver requests loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregiver requests: " + error);
      return null;
    });
};
const getCaregiverRequests = (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregiverrequests`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("caregiver requests loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregiver requests: " + error);
      return null;
    });
};

const getCaregiverRequestsReceivedByUsername = (user, accessToken) => {
  axios
    .get(`${baseUrl}/getcaregiverrequestsreceived?username=${user}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("caregiver requests received loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregiver requests received: " + error);
      return null;
    });
};

const getParentCaregiversByUsername = (accessToken) => {
  return axios
    .get(`${baseUrl}/getparentcaregivers`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("parent caregivers loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading parent caregivers: " + error);
      return null;
    });
};

export { getCaregiverRequests, sendCaregiverRequest,getCaregiverRequestsSent, getCaregiveeRequestsSent,  getCaregiverRequestsReceivedByUsername, getParentCaregiversByUsername };


