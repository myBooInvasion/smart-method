import React from 'react';
import {
  createTheme, ThemeProvider
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LeftSiderComp from './components/sider/LeftSiderComp';
import ContentComp from './components/content/ContentComp';
import AlternatifUserComp from './components/content/AlternatifUserComp';
import ResultsComp from './components/result/ResultsComp';
import './App.css';
import SiderMobile from './components/sider/SiderMobile';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      drawer: false,
    }
  }

  openCloseDrawer = () => {
    this.setState({drawer: !this.state.drawer});
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <div className="App box-wrapper d-flex justify-content-end w-100 min-vh-100" style={{backgroundColor: '#202332'}}>
            <LeftSiderComp />
            <SiderMobile open={this.state.drawer} toggle={this.openCloseDrawer} />
            <Routes>
              {/* core content */}
              <Route path='/' element={<ContentComp toggleDrawer={this.openCloseDrawer} />}>
                <Route path='' element={<AlternatifUserComp />} />
                <Route path='results' element={<ResultsComp />} />
              </Route>
            </Routes>
            <ToastContainer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
