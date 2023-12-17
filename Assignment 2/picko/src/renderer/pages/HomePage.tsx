import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../context/OrderContext';
import SummarySidebar from '../components/SummarySidebar';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order>({ items: [] });

  return (
    <div className="grid h-screen grid-cols-12">
      {/* Main Content */}
      <div className="col-span-7 overflow-y-auto p-4 md:col-span-8 lg:col-span-9">
        <h1 className="mb-8 text-2xl font-semibold">Aktivna naročila</h1>
      </div>

      {/* Sticky Sidebar */}
      <div
        className="sticky top-0 col-span-5 md:col-span-4 lg:col-span-3"
        style={{ height: `calc(100vh - 73px` }}
      >
        <SummarySidebar order={selectedOrder} />
      </div>
    </div>
  );
};
export default HomePage;
