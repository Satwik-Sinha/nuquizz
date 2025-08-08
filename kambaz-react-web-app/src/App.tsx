// import Labs from "./Labs";
import Kambaz from "./Kambaz";
import store from "./Kambaz/store";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { northwesternTheme } from './Kambaz/theme';

export default function App() {
  return (
    <ThemeProvider theme={northwesternTheme}>
      <CssBaseline />
      <HashRouter>
        <Provider store={store}>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="Kambaz" />} />
           {/*<Route path="/Labs/*" element={<Labs />} />*/}
            <Route path="/Kambaz/*" element={<Kambaz />} />

          </Routes>
        </div>
        </Provider>
      </HashRouter>
    </ThemeProvider>);
}
