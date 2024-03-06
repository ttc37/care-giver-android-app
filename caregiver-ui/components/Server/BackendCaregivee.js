import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";

const createCaregiveeCaregiverConnection = (caregivee, accessToken) => {
  axios
    .post(`${baseUrl}/createcaregivee`, caregivee, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("caregivees loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregivees: " + error);
      return null;
    });
}

const getCaregivees = (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregivees`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("caregivees loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregivees: " + error);
      return null;
    });
};

export { getCaregivees , createCaregiveeCaregiverConnection};


