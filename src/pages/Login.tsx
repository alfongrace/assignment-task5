import { useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import BigButton from "../components/BigButton";
import Spacer from "../components/Spacer";
import { AuthenticationContext } from "../context/AuthenticationContext";
import logoImg from "../images/logo.png";
import * as api from "../services/api";
import { getFromCache, setInCache } from "../services/caching";
import { User } from "../types/User";
import { isTokenExpired, sanitizeEmail, validateEmail } from "../utils";

/**
 * @component Login
 * @description The main screen component for user authentication.
 * * @responsibility 1. Handles local state management for email, password, and validation errors.
 * @responsibility 2. Fetches and attempts to restore cached user information and access token on load.
 * @responsibility 3. Manages the visual feedback for authentication (loading spinner, error alerts).
 * @responsibility 4. Coordinates user input validation and initiates the remote authentication process.
 * * @capability Allows users to input their email and password.
 * @capability Validates email format and password length (must be >= 6 characters).
 * @capability Navigates the user to the 'EventsMap' screen upon successful authentication or restored session.
 * * @param {StackScreenProps<any>} props - Navigation properties from React Navigation Stack.
 * @returns {JSX.Element} The rendered login screen.
 */
export default function Login({ navigation }: StackScreenProps<any>) {
  const authenticationContext = useContext(AuthenticationContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState<boolean>();
  const [passwordIsInvalid, setPasswordIsInvalid] = useState<boolean>();
  const [authError, setAuthError] = useState<string>();

  const [accessTokenIsValid, setAccessTokenIsValid] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    // ... cache fetching and error handling logic
  }, [authError]);

  useEffect(() => {
    if (accessTokenIsValid && authenticationContext?.value)
      navigation.navigate("EventsMap");
  }, [accessTokenIsValid]);

  /**
   * @function handleAuthentication
   * @description Attempts to log the user in by validating the form and calling the authentication API.
   * @returns {void}
   * * Side Effects:
   * - Calls 'api.authenticateUser' with sanitized email and password.
   * - On success: Caches user info and token, updates context, sets 'isAuthenticating' to false, and navigates to 'EventsMap'.
   * - On failure: Displays an error alert via 'setAuthError' and sets 'isAuthenticating' to false.
   */
  const handleAuthentication = () => {
    if (formIsValid()) {
      setIsAuthenticating(true);
      api
        .authenticateUser(sanitizeEmail(email), password)
        .then((response) => {
          setInCache("userInfo", response.data.user);
          setInCache("accessToken", response.data.accessToken);
          authenticationContext?.setValue(response.data.user);
          setIsAuthenticating(false);
          navigation.navigate("EventsMap");
        })
        .catch((error) => {
          if (error.response) {
            setAuthError(error.response.data);
          } else {
            setAuthError("Something went wrong.");
          }
          setIsAuthenticating(false);
        });
    }
  };

  /**
   * @function formIsValid
   * @description Checks if both the email and password fields meet their validation requirements.
   * @returns {boolean} True if both email and password are valid, false otherwise.
   */
  const formIsValid = () => {
    const emailIsValid = !isEmailInvalid();
    const passwordIsValid = !isPasswordInvalid();
    return emailIsValid && passwordIsValid;
  };

  /**
   * @function isPasswordInvalid
   * @description Validates the password length (must be 6 or more characters).
   * @returns {boolean} True if the password is less than 6 characters, false otherwise.
   * * Side Effects: Updates the 'passwordIsInvalid' state based on the validation result.
   */
  const isPasswordInvalid = (): boolean => {
    const invalidCheck = password.length < 6;
    setPasswordIsInvalid(invalidCheck);
    return invalidCheck ? true : false;
  };

  /**
   * @function isEmailInvalid
   * @description Validates the email format using the external 'validateEmail' utility.
   * @returns {boolean} True if the email format is invalid, false otherwise.
   * * Side Effects: Updates the 'emailIsInvalid' state based on the validation result.
   */
  const isEmailInvalid = (): boolean => {
    const invalidCheck = !validateEmail(email);
    setEmailIsInvalid(invalidCheck);
    return invalidCheck ? true : false;
  };

  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      colors={["#031A62", "#00A3FF"]}
      style={styles.gradientContainer}
    >
      {isFocused && <StatusBar animated translucent style="light" />}
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          padding: 24,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {/* ... JSX for Image, Inputs, Button, and Spinner ... */}
        <Image
          resizeMode="contain"
          style={{
            width: 240,
            height: 142,
            alignSelf: "center",
          }}
          source={logoImg}
        />
        <Spacer size={80} />
        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Email</Text>
          {emailIsInvalid && <Text style={styles.error}>invalid email</Text>}
        </View>
        <TextInput
          style={[styles.input, emailIsInvalid && styles.invalid]}
          onChangeText={(value) => setEmail(value)}
          onEndEditing={isEmailInvalid}
        />

        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Password</Text>
          {passwordIsInvalid && (
            <Text style={styles.error}>invalid password</Text>
          )}
        </View>
        <TextInput
          style={[styles.input, passwordIsInvalid && styles.invalid]}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          onEndEditing={isPasswordInvalid}
        />
        <Spacer size={80} />
        <BigButton
          style={{ marginBottom: 8 }}
          onPress={handleAuthentication}
          label="Log in"
          color="#FF8700"
        />
        <Spinner
          visible={isAuthenticating}
          textContent={"Authenticating..."}
          overlayColor="#031A62BF"
          textStyle={styles.spinnerText}
        />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  spinnerText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },

  label: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  inputLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#D3E2E5",
    borderRadius: 8,
    height: 56,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    color: "#5C8599",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  invalid: {
    borderColor: "red",
  },

  error: {
    color: "white",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
  },
});
