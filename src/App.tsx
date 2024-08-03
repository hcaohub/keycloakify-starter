import { Header } from "./Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
  }
});

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      {/* Provide all your global provider here like redux ect... */}
      <AppContextualized />
    </ThemeProvider>
  );

}


function AppContextualized() {
  return (
    <>
      <Header />
      <main>
        <h1>Not blocked by authentication initialization</h1>
      </main>
    </>
  );

}
