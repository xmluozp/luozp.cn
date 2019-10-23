import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
// import 'animate.css';
import './index.scss';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import StoreProvider from "./context/store";
import HttpsRedirect from 'react-https-redirect';


ReactDOM.render(
<HttpsRedirect>
    <Router>
        <StoreProvider>
            <App />
        </StoreProvider>
    </Router>
</HttpsRedirect>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
