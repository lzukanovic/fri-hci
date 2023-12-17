import React, { createContext, useContext, useState } from 'react';

export type Size = 's' | 'm' | 'l';
export interface Pizza {
  id: number;
  name: string;
  basePrice: number;
  size?: Size;
  student?: boolean;
  defaultToppings: Topping[];
}
export interface Topping {
  id: number;
  name: string;
  price: number;
}
export interface OrderItem {
  pizza: Pizza;
  removedToppings?: Topping[];
  toppings: Topping[];
  quantity: number;
}
export interface Order {
  customerName?: string;
  deliveryAddress?: string;
  phoneNumber?: string;
  items: OrderItem[];
  createdAt?: Date;
}
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (newOrder: Order) => {
    setOrders([...orders, newOrder]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
