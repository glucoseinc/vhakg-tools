import ActionObjectSearch from 'action_object_search/ActionObjectSearch';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from 'root/App';

const Router = () => {
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
