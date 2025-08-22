import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 
import AuthProvider from './context/AuthContext';
import UserContext from './context/userContext';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserContext>
          <App />
        </UserContext>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
