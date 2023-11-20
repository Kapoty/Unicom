import React from "react";
import { createRoot } from 'react-dom/client';

import MainRoute from "routes/MainRoute";
import { useHistory } from 'react-router';

import { red } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter as Router, Route, Link, HashRouter, Routes} from "react-router-dom";

const theme = createTheme({
  palette: {
      mode: "dark",
      primary: grey,
      background: {
         default: "#000000",
         paper: "#000000",
       },
   }
});

class SiteRouter extends React.Component {

   render() {
      return <HashRouter>
               <React.Fragment>
                   <ThemeProvider theme={theme}>
               		 <div id="app">
                      <MainRoute/>
                        
                     </div>
                  </ThemeProvider>
               </React.Fragment>
            </HashRouter>
   }

   /*

 <Routes>
                              <Route path="/" component={MainRoute} />
                        </Routes>
   */
}

const root = createRoot( document.getElementById("root"));

root.render(<SiteRouter/>,);