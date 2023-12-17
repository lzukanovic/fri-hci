import './App.css';
import 'tailwindcss/tailwind.css';
import 'flowbite';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import OrderPage from './pages/OrderPage';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Navbar />

      <OrderProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </OrderProvider>
    </Router>
  );
}
