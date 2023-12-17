import { useState } from 'react';
import {
  Order,
  OrderItem,
  Pizza,
  Topping,
  useOrderContext,
} from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import SummarySidebar from '../components/SummarySidebar';
import { MdCreditCard } from 'react-icons/md';
import OrderItemCardNew from '../components/OrderItemCardNew';
import OrderItemCard from '../components/OrderItemCard';

const AVAILABLE_PIZZAS: Pizza[] = [
  { id: 1, name: 'Margherita', basePrice: 10.0, defaultToppings: [] },
  { id: 2, name: 'Pepperoni', basePrice: 12.0, defaultToppings: [] },
  { id: 3, name: 'Vegetarian', basePrice: 11.0, defaultToppings: [] },
];
const AVAILABLE_TOPPINGS: Topping[] = [
  { id: 1, name: 'Mushrooms', price: 1.5 },
  { id: 2, name: 'Extra Cheese', price: 2.0 },
  { id: 3, name: 'Peppers', price: 1.0 },
];

// Add mock data to the order
const mockOrder: Order = {
  customerName: 'John Doe',
  deliveryAddress: '123 Main Street',
  phoneNumber: '040 123 456',
  items: [
    {
      pizza: { ...AVAILABLE_PIZZAS[0], size: 'm', student: true },
      toppings: [AVAILABLE_TOPPINGS[0], AVAILABLE_TOPPINGS[1]],
      quantity: 1,
    },
    {
      pizza: { ...AVAILABLE_PIZZAS[1], size: 'l', student: false },
      toppings: [AVAILABLE_TOPPINGS[1], AVAILABLE_TOPPINGS[2]],
      quantity: 2,
    },
  ],
  createdAt: new Date(),
};

const OrderPage = () => {
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState<Order>(mockOrder);
  const { addOrder } = useOrderContext();

  const addPizzaToOrder = (pizza: Pizza) => {
    const newOrderItem: OrderItem = { pizza, toppings: [], quantity: 1 };
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      items: [...prevOrder.items, newOrderItem],
    }));
  };

  const addToppingToPizza = (orderItemIndex: number, topping: Topping) => {
    setCurrentOrder((prevOrder) => {
      const updatedItems = [...prevOrder.items];
      const updatedItem = { ...updatedItems[orderItemIndex] };
      updatedItem.toppings = [...updatedItem.toppings, topping];
      updatedItems[orderItemIndex] = updatedItem;
      return { ...prevOrder, items: updatedItems };
    });
  };

  // Function to finalize and save the order
  const finalizeOrder = () => {
    const finalizedOrder = {
      ...currentOrder,
      createdAt: new Date(),
    };

    addOrder(finalizedOrder);
    setCurrentOrder({ items: [] }); // Reset current order
    navigate('/summary');
  };

  return (
    <div
      className="grid h-screen grid-cols-12"
      style={{ height: `calc(100vh - 73px` }}
    >
      {/* Main Content */}
      <div className="col-span-7 overflow-y-auto p-4 md:col-span-8 lg:col-span-9">
        <h1 className="mb-8 text-2xl font-semibold">Novo naročilo</h1>

        <div className="mb-8">
          <h2 className="mb-2 text-xl">Naročilo</h2>
          {/* Item Cards */}
          {currentOrder.items.map((item, index) => (
            <div className="mb-2">
              <OrderItemCard key={index} item={item} />
            </div>
          ))}
          {/* New Item Card */}
          <OrderItemCardNew />
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl">Naročnik</h2>
          {/* Customer Name */}
          <div className="mb-4">
            <label
              htmlFor="customerName"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Ime
            </label>
            <input
              type="text"
              id="customerName"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Ime naročnika"
              required
            />
          </div>
          {/* Customer Address */}
          <div className="mb-4">
            <label
              htmlFor="customerAddress"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Naslov
            </label>
            <input
              type="text"
              id="customerAddress"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Naslov naročnika"
              required
            />
          </div>
          {/* Payment method */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Način plačila
            </label>
            {/* Payment - Cash */}
            <div className="mb-2 flex items-center rounded border border-gray-200 ps-4 dark:border-gray-700">
              <input
                checked
                id="paymentMethod-2"
                type="radio"
                value=""
                name="paymentMethod"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="paymentMethod-2"
                className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Gotovina
              </label>
            </div>
            {/* Payment - Credit Card */}
            <div className="flex items-center rounded border border-gray-200 pe-4 ps-4 dark:border-gray-700">
              <input
                id="paymentMethod-1"
                type="radio"
                value=""
                name="paymentMethod"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="paymentMethod-1"
                className="ms-2 flex flex-1 flex-wrap items-center py-4"
              >
                <span className="me-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Kartica
                </span>
                {/* Credit Card Number */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 top-0 flex items-center ps-3.5">
                    <MdCreditCard />
                  </div>
                  <input
                    type="text"
                    id="creditCardNumber"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                    placeholder="0000-0000-0000-0000"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Sidebar */}
      <div className="sticky top-0 col-span-5 md:col-span-4 lg:col-span-3">
        <SummarySidebar order={currentOrder} />
      </div>
    </div>
  );
};

export default OrderPage;
