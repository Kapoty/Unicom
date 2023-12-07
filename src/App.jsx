import React from "react";
import { createRoot } from 'react-dom/client';

import MainRoute from "routes/MainRoute";
import { useHistory } from 'react-router';

import { red } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter, Routes, Route} from "react-router-dom";

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
      return <BrowserRouter>
                <ThemeProvider theme={theme}>
            		 <div id="app">
                      <Routes>
                           <Route path="/*" element={<MainRoute/>} />
                     </Routes>
                  </div>
               </ThemeProvider>
            </BrowserRouter>
   }
}

const root = createRoot( document.getElementById("root"));

root.render(<SiteRouter/>,);