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
import { MdCreditCard, MdCall, MdCalendarMonth } from 'react-icons/md';
import OrderItemCardNew from '../components/OrderItemCardNew';
import OrderItemCard from '../components/OrderItemCard';

const AVAILABLE_PIZZAS: Pizza[] = [
  { id: 1, name: 'Margerita', price: 10.0, defaultToppings: [] },
  { id: 2, name: 'Klasika', price: 12.0, defaultToppings: [] },
  { id: 3, name: 'Begi', price: 11.0, defaultToppings: [] },
];
const AVAILABLE_TOPPINGS: Topping[] = [
  { id: 1, name: 'Gobice', price: 1.5 },
  { id: 2, name: 'Sir', price: 2.0 },
  { id: 3, name: 'Paprika', price: 1.0 },
  { id: 4, name: 'Mozzarela', price: 1.0 },
  { id: 5, name: 'Pelati', price: 1.0 },
  { id: 6, name: 'Šunka', price: 1.0 },
  { id: 7, name: 'Panceta', price: 1.0 },
  { id: 8, name: 'Rukola', price: 1.0 },
];

// Add mock data to the order
const mockOrder: Order = {
  customerName: 'Janez Novak',
  deliveryAddress: 'Prešernova cesta 13, Ljubljana',
  phoneNumber: '040 123 456',
  paymentMethod: 'card',
  creditCardNumber: '1234-1234-1234-1234',
  items: [
    {
      pizza: { ...AVAILABLE_PIZZAS[0], size: 'm' },
      removedToppings: [AVAILABLE_TOPPINGS[0]],
      toppings: [AVAILABLE_TOPPINGS[0], AVAILABLE_TOPPINGS[1]],
      quantity: 1,
      student: true,
    },
    {
      pizza: { ...AVAILABLE_PIZZAS[1], size: 'l' },
      toppings: [AVAILABLE_TOPPINGS[1], AVAILABLE_TOPPINGS[2]],
      quantity: 2,
      student: false,
    },
  ],
  createdAt: new Date(),
};

const defaultOrder: Order = {
  customerName: '',
  deliveryAddress: '',
  paymentMethod: 'cash',
  items: [],
  createdAt: new Date(),
};

const OrderPage = () => {
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState<Order>(mockOrder);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { addOrder } = useOrderContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    setCurrentOrder(defaultOrder); // Reset current order
    navigate('/summary');
  };

  return (
    <div
      className="relative grid h-screen grid-cols-12 overflow-hidden"
      style={{ height: `calc(100vh - 73px` }}
    >
      {/* <button
        onClick={toggleSidebar}
        className="absolute right-0 top-0 z-50 sm:hidden"
      >
        Menu
      </button> */}

      {/* Main Content */}
      <div className="col-span-12 overflow-y-auto p-4 sm:col-span-7 md:col-span-8 lg:col-span-9">
        <h1 className="mb-8 text-2xl font-semibold">Novo naročilo</h1>

        <div className="mb-8">
          <h2 className="mb-2 text-xl">Naročilo</h2>
          {/* Item Cards */}
          {currentOrder.items.map((item, index) => (
            <div key={index} className="mb-2">
              <OrderItemCard item={item} />
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
          {/* Phone Number */}
          <div className="mb-4">
            <label
              htmlFor="customerPhoneNumber"
              className="mb-2 block text-sm dark:text-white"
            >
              <span className="mr-1 font-medium text-gray-900">Telefon</span>
              <span className="text-gray-400">(opcijsko)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 text-gray-500">
                <MdCall />
              </div>
              <input
                type="text"
                id="customerPhoneNumber"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="000-000-000"
              />
            </div>
          </div>
          {/* Payment Method */}
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
                <div className="me-2">
                  <label htmlFor="creditCardNumber" className="sr-only">
                    Številka kartice:
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 text-gray-500">
                      <MdCreditCard />
                    </div>
                    <input
                      type="text"
                      id="creditCardNumber"
                      className="block w-56 rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                      placeholder="0000-0000-0000-0000"
                    />
                  </div>
                </div>
                <div className="me-2">
                  <label htmlFor="creditCardExpiration" className="sr-only">
                    Datum poteka kartice:
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 text-gray-500">
                      <MdCalendarMonth />
                    </div>
                    <input
                      type="text"
                      id="creditCardExpiration"
                      className="block w-24 rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      pattern="[0-9]{2}/[0-9]{2}"
                      placeholder="12/23"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="creditCardCVV" className="sr-only">
                    Koda CVV:
                  </label>
                  <input
                    type="number"
                    id="creditCardCVV"
                    className="block w-20 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="CVV"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Confirm button to open the summary where order is confirmed */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="block w-full whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 sm:hidden"
        >
          Potrdi naročilo
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`absolute inset-0 z-30 bg-black bg-opacity-50 transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0'
        } ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Summary Sidebar */}
      <div
        className={`absolute inset-y-0 right-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out sm:sticky sm:top-0 sm:col-span-5 sm:translate-x-0 md:col-span-4 lg:col-span-3`}
      >
        <div className="h-full w-80 bg-white sm:w-auto">
          <SummarySidebar order={currentOrder} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
