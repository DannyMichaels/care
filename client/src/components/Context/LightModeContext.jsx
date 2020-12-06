import React, { useState, useEffect } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { yellow, red, blue } from "@material-ui/core/colors";

const LightModeContext = React.createContext([{}, () => {}]);
function LightModeProvider({ children }) {
  const [lightMode, setLightMode] = useState("");
  const palletType = lightMode === "dark" ? "dark" : "light";
  const themeTextColor = lightMode === "dark" ? "#fff" : "#000";

  const mainPrimaryColor = lightMode === "light" ? blue[600] : yellow[700];
  const mainSecondaryColor = lightMode === "light" ? red[600] : "#ff8f00";

  const themeState = createMuiTheme({
    palette: {
      type: palletType,
      text: {
        primary: themeTextColor,
      },
      typography: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
      },
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });

  // logic to maintaining darkMode in local storage from stack overflow
  // https://stackoverflow.com/questions/63097218/darkmode-store-in-local-storage-react-with-material-ui
  useEffect(() => {
    const existingPreference = localStorage.getItem("lightMode");
    if (existingPreference) {
      existingPreference === "light"
        ? setLightMode("light")
        : setLightMode("dark");
    } else {
      setLightMode("dark");
      localStorage.setItem("lightMode", "dark");
    }
  }, []);

  return (
    <ThemeProvider theme={themeState}>
      <LightModeContext.Provider value={[lightMode, setLightMode]}>
        {children}
      </LightModeContext.Provider>
    </ThemeProvider>
  );
}

export { LightModeContext, LightModeProvider };
