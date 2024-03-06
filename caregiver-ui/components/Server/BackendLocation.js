import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";

const getLocations= (accessToken) => {
  return axios
    .get(`${baseUrl}/getlocations`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("locations loaded successfully: " + response);
      return response.data;
    })
    .catch((error) => {
      console.log("error loading locations: " + error);
      return null;
    });
};

export {getLocations};


