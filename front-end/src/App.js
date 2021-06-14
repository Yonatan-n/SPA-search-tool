import SearchBar from "./SearchBar";
import DisplayResults from "./DisplayResults";
import { useEffect, useState } from "react";
import { Container, CssBaseline, Fab } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import { SERVER_URL } from "./consts";

function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = createMuiTheme({
    palette: isDark
      ? {
        type: "dark",
        primary: {
          main: "#e9c46a",
        },
        secondary: {
          main: "#e9c46a",
        },
      }
      : {
        type: "light",
        primary: {
          main: "#006d77",
        },
        secondary: {
          main: "#006d77",
        },
      },
  });
  const fab_style = {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  };
  useEffect(() => {
    // dark/light mode
    setIsDark(Number(window.localStorage.getItem("isDark")));
    // is elastic populated?
    // if (!window.localStorage.getItem('pop-db')) {
    //   fetch(`${SERVER_URL}/populate-elastic'`, {
    //     method: "POST"
    //   })
    //     .then(() => window.localStorage.setItem('pop-db', 'true'));
    // }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("isDark", Number(isDark));
  }, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <header>
          <h1>
            Search Tool <SearchIcon />
          </h1>
        </header>
        <SearchBar />
        <DisplayResults />
        <Fab
          color={"secondary"}
          style={fab_style}
          onClick={() => setIsDark((isDark) => !isDark)}
        >
          <InvertColorsIcon />
        </Fab>
      </Container>
    </ThemeProvider>
  );
}

export default App;
