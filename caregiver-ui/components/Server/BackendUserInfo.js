import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";
const getUserInfo = (accessToken) => {
  return axios
    .get(`${baseUrl}/getuserinfo`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      console.log("user info loaded successfully: " + response.data);
      console.log(response.data.parent)
      return response.data;
    })
    .catch((error) => {
      console.log("error loading user info: " + error);
      return null;
    });
};

export default getUserInfo;
