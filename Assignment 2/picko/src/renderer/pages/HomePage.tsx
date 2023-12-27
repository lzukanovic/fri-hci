import { useState } from 'react';
import { Order, Status, useOrderContext } from '../context/OrderContext';
import SummarySidebar from '../components/SummarySidebar';
import OrderCard from '../components/OrderCard';
import useWindowSize from '../hooks/useWindowSize';

const HomePage = () => {
  const { width } = useWindowSize();
  const { activeOrders, completedOrders, updateOrder } = useOrderContext();
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const smBreakpoint = 640;

  const handleSelectOrder = (order: Order) => {
    if (order.id === selectedOrder?.id) {
      setSelectedOrder(undefined);
      if (width && width <= smBreakpoint) {
        setIsSidebarOpen(false);
      }
    } else {
      setSelectedOrder(order);
      if (width && width <= smBreakpoint) {
        setIsSidebarOpen(true);
      }
    }
  };

  const closeSidebar = () => {
    setSelectedOrder(undefined);
    setIsSidebarOpen(false);
  };

  const isSelected = (order: Order) => {
    return order.id === selectedOrder?.id;
  };

  // Add new canceled status to selected order and update it in context
  const cancelSelectedOrder = () => {
    if (selectedOrder && selectedOrder.statuses) {
      // Add new status
      const newStatus: Status = {
        name: 'canceled',
        createdAt: new Date(),
      };
      const newOrder = {
        ...selectedOrder,
        statuses: [...selectedOrder.statuses, newStatus],
      };
      // Update selected order
      setSelectedOrder(newOrder);
      // Update order in context
      updateOrder(newOrder);
    }
  };

  return (
    <div
      className="relative grid h-screen grid-cols-12 overflow-hidden bg-white dark:bg-gray-800 dark:text-white"
      style={{ height: `calc(100vh - 69px` }}
    >
      {/* Main Content */}
      <div className="col-span-12 space-y-6 overflow-y-auto p-4 sm:col-span-7 md:col-span-8 lg:col-span-9">
        {/* Active Orders */}
        <h1 className="text-2xl font-semibold">Aktivna naročila</h1>

        {/* List orders */}
        <div className="space-y-2">
          {activeOrders.map((order, index) => (
            <OrderCard
              key={index}
              order={order}
              isSelected={isSelected(order)}
              onClick={(o) => handleSelectOrder(o)}
            />
          ))}
        </div>

        {/* No active orders */}
        {activeOrders.length === 0 && (
          <p className="text-gray-500">Nobenih aktivnih naročil.</p>
        )}

        {/* Completed Orders */}
        <h1 className="text-2xl font-semibold">Zaključena naročila</h1>

        {/* List orders */}
        <div className="space-y-2">
          {completedOrders.map((order, index) => (
            <OrderCard
              key={index}
              order={order}
              isSelected={isSelected(order)}
              onClick={(o) => handleSelectOrder(o)}
            />
          ))}
        </div>

        {/* No completed orders */}
        {completedOrders.length === 0 && (
          <p className="text-gray-500">Nobenih zaključenih naročil.</p>
        )}
      </div>

      {/* Overlay */}
      <div
        className={`absolute inset-0 z-30 bg-black bg-opacity-50 transition-opacity sm:z-0 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0'
        } ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={closeSidebar}
      />

      {/* Summary Sidebar */}
      <div
        className={`absolute inset-y-0 right-0 z-40 transform overflow-y-auto sm:z-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out sm:sticky sm:top-0 sm:col-span-5 sm:translate-x-0 md:col-span-4 lg:col-span-3`}
      >
        <div className="flex h-full w-80 flex-col bg-white sm:w-auto">
          <SummarySidebar
            order={selectedOrder}
            onCancelOrder={cancelSelectedOrder}
          />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
