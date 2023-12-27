import React, { createContext, useContext, useState } from 'react';
import { v4 } from 'uuid';
import dayjs from 'dayjs';

type UUID = string;
export type Size = 's' | 'm' | 'l';
export type PaymentMethod = 'cash' | 'card';
export type StatusType =
  | 'created'
  | 'preparation'
  | 'prepared'
  | 'delivery'
  | 'delivered'
  | 'canceled';
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

export interface CreditCard {
  number?: string;
  expiration?: string;
  cvv?: string;
}
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
  creditCard?: CreditCard;
  items: OrderItem[];
  statuses?: Status[];
  createdAt: Date;
  note?: string;
}
interface OrderContextType {
  allOrders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

const mockOrders: Order[] = [
  {
    id: v4(),
    customerName: 'Janez Novak',
    deliveryAddress: 'Cesta na Brdo 123',
    phoneNumber: '031 123 456',
    paymentMethod: 'card',
    creditCard: {
      number: '1234 5678 9012 3456',
      expiration: '12/2022',
      cvv: '123',
    },
    items: [
      {
        id: v4(),
        pizza: {
          name: 'margarita',
          basePrice: 5,
          size: 'm',
          defaultToppings: [
            {
              name: 'cheese',
            },
            {
              name: 'tomato',
            },
          ],
        },
        removedToppings: [],
        addedToppings: [
          {
            name: 'prosciutto',
            price: 1,
          },
        ],
        quantity: 2,
        student: true,
      },
    ],
    statuses: [
      {
        name: 'created',
        createdAt: dayjs().subtract(120, 'minute').toDate(),
      },
      {
        name: 'preparation',
        createdAt: dayjs().subtract(110, 'minute').toDate(),
      },
      {
        name: 'prepared',
        createdAt: dayjs().subtract(85, 'minute').toDate(),
      },
      {
        name: 'delivery',
        createdAt: dayjs().subtract(80, 'minute').toDate(),
      },
      {
        name: 'delivered',
        createdAt: dayjs().subtract(60, 'minute').toDate(),
      },
    ],
    createdAt: dayjs().subtract(120, 'minute').toDate(),
    note: 'Brez čebule',
  },
  {
    id: v4(),
    customerName: 'Jana Testo',
    deliveryAddress: 'Cesta na Brdo 123',
    phoneNumber: '031 123 456',
    paymentMethod: 'card',
    creditCard: {
      number: '1234 5678 9012 3456',
      expiration: '12/2022',
      cvv: '123',
    },
    items: [
      {
        id: v4(),
        pizza: {
          name: 'margarita',
          basePrice: 5,
          size: 'm',
          defaultToppings: [
            {
              name: 'cheese',
            },
            {
              name: 'tomato',
            },
          ],
        },
        removedToppings: [
          {
            name: 'cheese',
          },
        ],
        addedToppings: [
          {
            name: 'prosciutto',
            price: 1,
          },
          {
            name: 'corn',
            price: 1,
          },
          {
            name: 'artichoke',
            price: 1,
          },
        ],
        quantity: 2,
        student: true,
      },
    ],
    statuses: [
      {
        name: 'created',
        createdAt: dayjs().subtract(20, 'minute').toDate(),
      },
      {
        name: 'preparation',
        createdAt: dayjs().subtract(10, 'minute').toDate(),
      },
    ],
    createdAt: dayjs().subtract(20, 'minute').toDate(),
    note: 'Brez čebule',
  },
  {
    id: v4(),
    customerName: 'Mojca Kekec',
    deliveryAddress: 'Cesta na Brdo 123',
    phoneNumber: '031 123 456',
    paymentMethod: 'card',
    creditCard: {
      number: '1234 5678 9012 3456',
      expiration: '12/2022',
      cvv: '123',
    },
    items: [
      {
        id: v4(),
        pizza: {
          name: 'margarita',
          basePrice: 5,
          size: 'm',
          defaultToppings: [
            {
              name: 'cheese',
            },
            {
              name: 'tomato',
            },
          ],
        },
        removedToppings: [
          {
            name: 'cheese',
          },
        ],
        addedToppings: [
          {
            name: 'prosciutto',
            price: 1,
          },
        ],
        quantity: 2,
        student: true,
      },
      {
        id: v4(),
        pizza: {
          name: 'seafood',
          basePrice: 14,
          size: 's',
          defaultToppings: [
            { name: 'cheese' },
            { name: 'tomato' },
            { name: 'tuna' },
            { name: 'onion' },
            { name: 'corn' },
          ],
        },
        addedToppings: [
          {
            name: 'sourCream',
            price: 1,
          },
        ],
        quantity: 1,
        student: false,
      },
    ],
    statuses: [
      {
        name: 'created',
        createdAt: dayjs().subtract(5, 'minute').toDate(),
      },
    ],
    createdAt: dayjs().subtract(5, 'minute').toDate(),
    note: 'Brez čebule',
  },
];

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(
    (window.electron.store.get('orders') as Order[]) || mockOrders,
  );

  window.electron.ipcRenderer.on('reset-data-trigger', () => {
    setOrders(mockOrders);
    window.electron.store.set('orders', null);
  });
  window.electron.ipcRenderer.on('clear-data-trigger', () => {
    setOrders([]);
    window.electron.store.set('orders', null);
  });

  const addOrder = (newOrder: Order) => {
    setOrders([...orders, newOrder]);
    window.electron.store.set('orders', orders);
  };
  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
    window.electron.store.set('orders', orders);
  };

  const allOrders = orders;
  const activeOrders = orders.filter((order) => {
    return order.statuses?.[order.statuses.length - 1].name !== 'delivered';
  });
  const completedOrders = orders.filter((order) => {
    return order.statuses?.[order.statuses.length - 1].name === 'delivered';
  });

  return (
    <OrderContext.Provider
      value={{
        allOrders,
        activeOrders,
        completedOrders,
        addOrder,
        updateOrder,
      }}
    >
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
