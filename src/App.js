import logo from './logo.svg';
import './App.css';
import WaitingRoom from './components/WaitingRoom';
import EndCall from './components/EndCall';
import ProtectedRoute from './components/ProtectedRoute';
import Wrapper from './components/Wrapper';

import { createTheme } from '@material-ui/core/styles';
import { PreferencesContext } from './context/PreferencesContext';

import { ThemeProvider } from '@material-ui/styles';
import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

let primary = process.env.REACT_APP_PALETTE_PRIMARY || '#b779ff';
let secondary = process.env.REACT_APP_PALETTE_SECONDARY || '#d6219c';

const theme = () => {
  return createTheme({
    palette: {
      type: 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      bodyBackground: {
        black: '#131415',
      },
      callBackground: {
        main: '#20262D',
      },
      toolbarBackground: {
        main: '#41464D',
      },
      activeButtons: {
        green: '#1C8731',
        red: '#D50F2C',
      },
    },
  });
};

function App() {
  const [preferences, setPreferences] = useState({
    hasSetUpPreferences: false,
    userName: null,
    conversationId: null,
  });

  const preferencesValue = useMemo(
    () => ({ preferences, setPreferences }),
    [preferences, setPreferences]
  );
  return (
    <ThemeProvider theme={theme()}>
      <Router>
        <PreferencesContext.Provider value={preferencesValue}>
          <Switch>
            <ProtectedRoute exact path="/room/:roomName" component={Wrapper} />
            <Route path="/room/:roomName/:conversationId/end">
              <EndCall />
            </Route>
            <Route path="/">
              <WaitingRoom />
            </Route>
          </Switch>
        </PreferencesContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
