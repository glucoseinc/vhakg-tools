import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './root/App';
import ActionObjectSearch from './action_object_search/ActionObjectSearch';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/action-object-search',
    element: <ActionObjectSearch />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
