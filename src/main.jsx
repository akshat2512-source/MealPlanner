import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { MealPlanProvider } from './context/MealPlanContext.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MealPlanProvider>
        <App />
      </MealPlanProvider>
    </BrowserRouter>
  </React.StrictMode>
);
