import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Items from './pages/Items';
import Addresses from './pages/Addresses';
import ErrorPage from './pages/ErrorPage';
import { AddressControllerApi, CustomerControllerApi, InvoiceControllerApi, ItemControllerApi } from './generated';

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: () => redirect("/invoices"),
      },
      {
        path: "/invoices",
        element: <Invoices />,
        loader: () => {
          const api = new InvoiceControllerApi();
          return api.index1();
        }
      },
      {
        path: "/customers",
        element: <Customers />,
        loader: () => {
          const api = new CustomerControllerApi();
          return api.index2();
        }
      },
      {
        path: "/items",
        element: <Items />,
        loader: () => {
          const api = new ItemControllerApi();
          return api.index();
        }
      },
      {
        path: "/addresses",
        element: <Addresses />,
        loader: async () => {
          const api = new AddressControllerApi();
          const response = await api.index3();

          if (!response || !response.content) {
            throw new Response("No addresses found", { status: 404 });
          }

          return response;
        }
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;