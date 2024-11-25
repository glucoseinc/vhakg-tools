import ActionObjectSearch from 'pages/action_object_search';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from 'pages';
import React from 'react';

const Router = (): React.ReactElement => {
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

  return <RouterProvider router={router} />;
};
export default Router;
