import * as React from "react";
import { ToastAndroid } from "react-native";
import { withAuthenticator } from "aws-amplify-react-native";
import { Hub } from "aws-amplify";
import { Dialog } from "react-native-elements";
import CaregiverHomePage from "../HomePage/CaregiverHomePage";
import CaregiveeHomePage from "../HomePage/CaregiveeHomePage";
import login from "../Server/BackendLogin";
import { useState, useEffect } from "react";
const AuthenticationWrapper = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setError] = useState([]);
  const { logoutFunction } = props;
  const { navigation } = props;
  useEffect(() => {
    if (props.authData && !isAuthenticated) {
      login(
        props.authData.signInUserSession.idToken.jwtToken,
        props.route.params.isCaregiver,
        props.route.params.isParent
      ).then((isSuccess) => {
        console.log("SUCCESS " + isSuccess)
        if (isSuccess.completionStatus === "Complete") {
          setIsAuthenticated(true);
        } else if (isSuccess.completionStatus === "Incomplete"){
          ToastAndroid.show(
            "Error Logging in. Please Wait and Try Again",
            ToastAndroid.LONG
          );
          navigation.navigate("CaregiverCaregiveeChoice");
        }
      });
    }
  });
  // Add caregiver caregivee specific screen entry points here.
  return isAuthenticated ? (
    props.route.params.isCaregiver ? (
      <CaregiverHomePage
        user={
          props.authData.signInUserSession.idToken.payload["cognito:username"]
        }
        userToken={props.authData.signInUserSession.accessToken.jwtToken}
        parent={props.route.params.isParent}
        email={props.authData.signInUserSession.idToken.payload["email"]}
        logoutFunction={logoutFunction}
      />
    ) : (
      <CaregiveeHomePage
        user={
          props.authData.signInUserSession.idToken.payload["cognito:username"]
        }
        email={props.authData.signInUserSession.idToken.payload["email"]}
        userToken={props.authData.signInUserSession.accessToken.jwtToken}
        logoutFunction={logoutFunction}
      />
    )
  ) : (
    <Dialog.Loading />
  );
};

export default withAuthenticator(AuthenticationWrapper);
