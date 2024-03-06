import axios from "axios";
import baseUrl from './ipconstant'
//const baseUrl = "http://44.203.108.190:80";
const login = (id_token, caregiver, parent) => {
  console.log("LOGIN: " + caregiver + " " + parent)
  return axios
    .get(`${baseUrl}/login`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${id_token}`,
      },
      params: {
        isCaregiver: caregiver,
        isParent: parent 
      },
    })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error.response);
      return {completionStatus: "Incomplete"};
    });
};

export default login;


