import axios from "axios";
const baseUrl = "http://44.203.108.190:80";

const createCaregiverCaregiverConnection = (caregiver, accessToken) => {
  axios
    .post(`${baseUrl}/createcaregiver`, caregiver, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
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

const updateCaregiver = (caregiver, accessToken) => {
  axios
    .put(`${baseUrl}/updatecaregiver`, caregiver, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      console.log("success" + response);
    })
    .catch((error) => {
      console.log("error" + error);
    });
};

const getCaregivers= (accessToken) => {
  return axios
    .get(`${baseUrl}/getcaregivers`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((response) => {
      console.log("caregivers loaded successfully: " + response);
      console.log(response.data)
      return response.data;
    })
    .catch((error) => {
      console.log("error loading caregivers: " + error);
      return null;
    });
};

export {getCaregivers, updateCaregiver, createCaregiverCaregiverConnection};


