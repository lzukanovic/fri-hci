import React from 'react';
import { Order } from '../context/OrderContext';

interface SummarySidebarProps {
  order: Order;
  editMode?: boolean;
}

const SummarySidebar: React.FC<SummarySidebarProps> = ({
  order,
  editMode = false,
}) => {
  const hasOrderData = () => {
    return order && (order.items.length > 0 || order.customerName);
  };

  return (
    <div className="h-full w-full overflow-y-auto border-l p-4">
      <h1 className="mb-8 text-2xl font-semibold">Podrobnosti naročila</h1>
      {hasOrderData() ? (
        <>
          <h2 className="mb-4 text-xl">Naročilo</h2>
          <h2 className="text-xl">Naročnik</h2>
          <div>
            {/* Map through order items and display them */}
            {order.items.map((item, index) => (
              <div key={index}>
                <p>{item.pizza.name}</p>
                {/* Add more details as needed */}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">
          {editMode
            ? 'Podatki o naročilu se vam bodo sproti izpisovali tukaj'
            : 'Izberite naročilo za prikaz podrobnosti'}
        </p>
      )}
    </div>
  );
};

export default SummarySidebar;
