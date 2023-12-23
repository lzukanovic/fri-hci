import React, { createContext, useContext, useState } from 'react';

type UUID = string;
export type Size = 's' | 'm' | 'l';
export type PaymentMethod = 'cash' | 'card';
export type StatusType =
  | 'accepted'
  | 'preparation'
  | 'prepared'
  | 'delivery'
  | 'delivered';
export type PizzaType =
  | 'margarita'
  | 'classic'
  | 'vegetarian'
  | 'country'
  | 'karst'
  | 'seafood';
export type ToppingType =
  | 'corn'
  | 'egg'
  | 'artichoke'
  | 'zucchini'
  | 'sourCream'
  | 'onion'
  | 'prosciutto'
  | 'pepper'
  | 'cheese'
  | 'tomato'
  | 'ham'
  | 'mushrooms'
  | 'tuna'
  | string; // Allows for custom toppings as strings

export interface Status {
  name: StatusType;
  createdAt: Date;
}
export interface Pizza {
  name: PizzaType;
  basePrice: number;
  size: Size;
  defaultToppings: DefaultTopping[];
}
export interface Topping {
  name: ToppingType;
  customDisplayName?: string;
  price: number;
}
export type DefaultTopping = Omit<Topping, 'customDisplayName' | 'price'>;
export interface OrderItem {
  id: UUID;
  pizza: Pizza;
  removedToppings?: DefaultTopping[];
  addedToppings: Topping[];
  quantity: number;
  student?: boolean;
}
export interface Order {
  id: UUID;
  customerName: string;
  deliveryAddress: string;
  phoneNumber?: string;
  paymentMethod: PaymentMethod;
  creditCardNumber?: string;
  items: OrderItem[];
  statuses?: Status[];
  createdAt: Date;
  note?: string;
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
