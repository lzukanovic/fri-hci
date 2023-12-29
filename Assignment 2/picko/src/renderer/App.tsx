import './App.css';
import 'tailwindcss/tailwind.css';
import 'flowbite';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import OrderPage from './pages/OrderPage';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <OrderProvider>
            <HomePage />
          </OrderProvider>
        </>
      ),
    },
    {
      path: '/order',
      element: (
        <>
          <Navbar />
          <OrderProvider>
            <OrderPage />
          </OrderProvider>
        </>
      ),
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
