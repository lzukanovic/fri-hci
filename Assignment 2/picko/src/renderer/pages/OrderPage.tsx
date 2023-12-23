import { useState } from 'react';
import { Order, OrderItem, useOrderContext } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import SummarySidebar from '../components/SummarySidebar';
import { MdCreditCard, MdCall, MdCalendarMonth } from 'react-icons/md';
import OrderItemCardNew from '../components/OrderItemCardNew';
import OrderItemCard from '../components/OrderItemCard';
import OrderItemModal from '../components/OrderItemModal';
import { DEFAULT_PIZZAS } from '../constants/pizza.constant';
import { DEFAULT_TOPPINGS } from '../constants/topping.constant';
import { v4 as uuidv4, NIL } from 'uuid';

// Add mock data to the order
const mockOrder: Order = {
  id: uuidv4(),
  customerName: 'Janez Novak',
  deliveryAddress: 'Prešernova cesta 13, Ljubljana',
  phoneNumber: '040 123 456',
  paymentMethod: 'card',
  creditCardNumber: '1234-1234-1234-1234',
  items: [
    {
      id: uuidv4(),
      pizza: { ...DEFAULT_PIZZAS[0], size: 'm' },
      removedToppings: [DEFAULT_TOPPINGS[0]],
      addedToppings: [DEFAULT_TOPPINGS[0], DEFAULT_TOPPINGS[1]],
      quantity: 1,
      student: true,
    },
    {
      id: uuidv4(),
      pizza: { ...DEFAULT_PIZZAS[1], size: 'l' },
      addedToppings: [DEFAULT_TOPPINGS[1], DEFAULT_TOPPINGS[2]],
      quantity: 2,
      student: false,
    },
  ],
  createdAt: new Date(),
};

const defaultOrder: Order = {
  id: NIL,
  customerName: '',
  deliveryAddress: '',
  paymentMethod: 'cash',
  items: [],
  createdAt: new Date(),
};

const OrderPage = () => {
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState<Order>(mockOrder);
  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { addOrder } = useOrderContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateOrCreateOrderItem = (item: OrderItem) => {
    const existingItem = currentOrder.items.find((i) => i.id === item.id);
    if (existingItem) {
      const updatedItems = currentOrder.items.map((i) =>
        i.id === item.id ? item : i,
      );
      setCurrentOrder({ ...currentOrder, items: updatedItems });
    } else {
      setCurrentOrder({
        ...currentOrder,
        items: [...currentOrder.items, item],
      });
    }
  };

  const duplicateOrderItem = (item: OrderItem) => {
    const duplicatedItem = {
      ...item,
      id: uuidv4(),
    };
    updateOrCreateOrderItem(duplicatedItem);
  };

  const deleteOrderItem = (item: OrderItem) => {
    const updatedItems = currentOrder.items.filter((i) => i.id !== item.id);
    setCurrentOrder({ ...currentOrder, items: updatedItems });
  };

  // TODO: Function to finalize and save the order
  // const finalizeOrder = () => {
  //   const finalizedOrder = {
  //     ...currentOrder,
  //     createdAt: new Date(),
  //   };

  //   addOrder(finalizedOrder);
  //   setCurrentOrder(defaultOrder); // Reset current order
  //   navigate('/summary');
  // };

  // Edit modal
  const openModalForItem = (item: OrderItem) => {
    setCurrentOrderItem(item);
    setOpenEditModal(true);
  };

  const openModalForNewItem = () => {
    setCurrentOrderItem(undefined);
    setOpenEditModal(true);
  };

  const onCloseEditModal = (item?: OrderItem) => {
    setOpenEditModal(false);
    if (item) {
      updateOrCreateOrderItem(item);
    }
    setCurrentOrderItem(undefined);
  };

  return (
    <>
      <div
        className="relative grid h-screen grid-cols-12 overflow-hidden bg-white dark:bg-gray-800 dark:text-white"
        style={{ height: `calc(100vh - 73px` }}
      >
        {/* Main Content */}
        <div className="col-span-12 space-y-8 overflow-y-auto p-4 sm:col-span-7 md:col-span-8 lg:col-span-9">
          <h1 className="text-2xl font-semibold">Novo naročilo</h1>

          <div className="space-y-2">
            <h2 className="text-xl">Naročilo</h2>
            {/* Item Cards */}
            {currentOrder.items.map((item) => (
              <div key={item.id}>
                <OrderItemCard
                  item={item}
                  onDuplicate={duplicateOrderItem}
                  onEdit={openModalForItem}
                  onDelete={deleteOrderItem}
                />
              </div>
            ))}
            {/* New Item Card */}
            <OrderItemCardNew onSelect={openModalForNewItem} />
          </div>
          <div>
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
                className="mb-2 block text-sm"
              >
                <span className="mr-1 font-medium text-gray-900 dark:text-white">
                  Telefon
                </span>
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
                  className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-200"
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
                  <span className="me-4 text-sm font-medium text-gray-900 dark:text-gray-200">
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
          <div>
            <h2 className="mb-2 text-xl">Opomba</h2>
            <div>
              <label
                htmlFor="message"
                className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Opomba
              </label>
              <textarea
                id="message"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Dodajte opombo na naročilo..."
              ></textarea>
            </div>
          </div>

          {/* Confirm button to open the summary where order is confirmed */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mt-4 block w-full whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 sm:hidden"
          >
            Potrdi naročilo
          </button>
        </div>

        {/* Overlay */}
        <div
          className={`absolute inset-0 z-30 bg-black bg-opacity-50 transition-opacity sm:z-0 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          } ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          onClick={toggleSidebar}
        />

        {/* Summary Sidebar */}
        <div
          className={`absolute inset-y-0 right-0 z-40 transform sm:z-0 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out sm:sticky sm:top-0 sm:col-span-5 sm:translate-x-0 md:col-span-4 lg:col-span-3`}
        >
          <div className="h-full w-80 bg-white sm:w-auto">
            <SummarySidebar order={currentOrder} />
          </div>
        </div>
      </div>
      <OrderItemModal
        item={currentOrderItem}
        show={openEditModal}
        onClose={onCloseEditModal}
      />
    </>
  );
};

export default OrderPage;
