import { useEffect, useState } from 'react';
import {
  CreditCard,
  Order,
  OrderItem,
  PaymentMethod,
  useOrderContext,
} from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import SummarySidebar from '../components/SummarySidebar';
import { MdCreditCard, MdCall, MdCalendarMonth } from 'react-icons/md';
import OrderItemCardNew from '../components/OrderItemCardNew';
import OrderItemCard from '../components/OrderItemCard';
import OrderItemModal from '../components/OrderItemModal';
import { DEFAULT_PIZZAS } from '../constants/pizza.constant';
import { DEFAULT_TOPPINGS } from '../constants/topping.constant';
import { v4 as uuidv4, NIL } from 'uuid';
import { useForm } from 'react-hook-form';
import { isEqual } from 'lodash';

// Add mock data to the order
const mockOrder: Order = {
  id: uuidv4(),
  customerName: 'Janez Novak',
  deliveryAddress: 'Prešernova cesta 13, Ljubljana',
  phoneNumber: '040 123 456',
  paymentMethod: 'card',
  creditCard: {
    number: '1234-1234-1234-1234',
    expiration: '12/23',
    cvv: '031',
  },
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
  const { addOrder } = useOrderContext();

  const [currentOrder, setCurrentOrder] = useState<Order>(defaultOrder);
  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem>();

  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm<Order>({
    defaultValues: {
      customerName: '',
      deliveryAddress: '',
      phoneNumber: '',
      paymentMethod: 'cash',
      creditCard: {
        number: '',
        expiration: '',
        cvv: '',
      },
      note: '',
    },
  });
  const watchedOrderMetadata = watch();
  const isCreditCardChecked = watch('paymentMethod') === 'card';

  const [isOrderItemsInvalid, setIsOrderItemsInvalid] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Order Item Card Handlers
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

  // Function to finalize and save the order
  const finalizeOrder = () => {
    // Validation
    validateEverything();
    if (Object.keys(errors).length != 0) return;

    if (currentOrder.items.length === 0) {
      setIsOrderItemsInvalid(true);
      return;
    }

    const createdAt = new Date();
    const finalizedOrder: Order = {
      ...currentOrder,
      id: uuidv4(),
      createdAt,
      statuses: [
        {
          name: 'created',
          createdAt,
        },
      ],
    };

    addOrder(finalizedOrder);
    setCurrentOrder(defaultOrder); // Reset current order
    navigate('/');
  };

  // Update current order on form change
  useEffect(() => {
    const data: Order = {
      ...currentOrder,
      customerName: watchedOrderMetadata.customerName,
      deliveryAddress: watchedOrderMetadata.deliveryAddress,
      phoneNumber: watchedOrderMetadata.phoneNumber,
      paymentMethod: watchedOrderMetadata.paymentMethod,
      creditCard: {
        number: watchedOrderMetadata.creditCard?.number,
        expiration: watchedOrderMetadata.creditCard?.expiration,
        cvv: watchedOrderMetadata.creditCard?.cvv,
      },
      note: watchedOrderMetadata.note,
      items: currentOrder.items,
    };

    if (!isEqual(currentOrder, data)) {
      setCurrentOrder(data);
    }
  }, [watchedOrderMetadata]);

  // Update validation if payment method changes
  useEffect(() => {
    validateCreditCardFields();
  }, [isCreditCardChecked]);

  // Form validation
  const validateEverything = async () => {
    await validateField('customerName');
    await validateField('deliveryAddress');
    await validateField('phoneNumber');
    await validateField('paymentMethod');
    if (isCreditCardChecked) {
      await validateCreditCardFields();
    }
  };
  const validateField = async (fieldName: keyof Order) => {
    await trigger(fieldName);
  };
  const validateCreditCardFields = async () => {
    await trigger('creditCard.number');
    await trigger('creditCard.expiration');
    await trigger('creditCard.cvv');
  };

  const getFieldStyle = (fieldName: keyof Order) => {
    return fieldStyle(!!errors[fieldName]);
  };
  const getCreditCardFieldStyle = (fieldName: keyof CreditCard) => {
    return fieldStyle(!!errors.creditCard?.[fieldName]);
  };
  const fieldStyle = (invalid: boolean) => {
    return invalid
      ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400'
      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500';
  };

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
      setIsOrderItemsInvalid(false);
    }
    setCurrentOrderItem(undefined);
  };

  return (
    <>
      <div
        className="relative grid h-screen grid-cols-12 overflow-hidden bg-white dark:bg-gray-800 dark:text-white"
        style={{ height: `calc(100vh - 69px` }}
      >
        {/* Main Content */}
        <div className="col-span-12 space-y-6 overflow-y-auto p-4 sm:col-span-7 md:col-span-8 lg:col-span-9">
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
            <OrderItemCardNew
              onSelect={openModalForNewItem}
              invalid={isOrderItemsInvalid}
            />
            {isOrderItemsInvalid && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                Dodajte vsaj eno pico.
              </p>
            )}
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
                {...register('customerName', {
                  required: 'Vnesite ime naročnika.',
                })}
                onBlur={() => validateField('customerName')}
                aria-invalid={errors.customerName ? 'true' : 'false'}
                className={`block w-full rounded-lg border p-2.5 text-sm ${getFieldStyle(
                  'customerName',
                )}`}
                placeholder="Ime naročnika"
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors?.customerName?.message}
              </p>
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
                {...register('deliveryAddress', {
                  required: 'Vnesite naslov naročnika.',
                })}
                onBlur={() => validateField('deliveryAddress')}
                aria-invalid={errors.deliveryAddress ? 'true' : 'false'}
                className={`block w-full rounded-lg border p-2.5 text-sm ${getFieldStyle(
                  'deliveryAddress',
                )}`}
                placeholder="Naslov naročnika"
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors?.deliveryAddress?.message}
              </p>
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
                  {...register('phoneNumber', {
                    pattern: {
                      value: /[0-9]{3} [0-9]{3} [0-9]{3}/,
                      message: 'Vnesite veljaven telefonski format.',
                    },
                  })}
                  onBlur={() => validateField('phoneNumber')}
                  aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                  className={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${getFieldStyle(
                    'phoneNumber',
                  )}`}
                  placeholder="031 000 000"
                />
              </div>
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors?.phoneNumber?.message}
              </p>
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
              <div className="mb-2 flex items-center rounded border border-gray-200 p-4 ps-4 dark:border-gray-700">
                <input
                  id="paymentMethod-2"
                  type="radio"
                  value="cash"
                  {...register('paymentMethod', { required: true })}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="paymentMethod-2"
                  className="ms-2 w-full text-sm font-medium text-gray-900 dark:text-gray-200"
                >
                  Gotovina
                </label>
              </div>
              {/* Payment - Credit Card */}
              <div className="flex items-start rounded border border-gray-200 p-4 dark:border-gray-700">
                <input
                  id="paymentMethod-1"
                  type="radio"
                  value="card"
                  {...register('paymentMethod', { required: true })}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="paymentMethod-1"
                  className="ms-2 flex flex-wrap gap-2"
                >
                  <span className="text-sm font-medium leading-4 text-gray-900 dark:text-gray-200">
                    Kartica
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {/* Credit Card Number */}
                    <div>
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
                          {...register('creditCard.number', {
                            required:
                              isCreditCardChecked &&
                              'Vnesite številko kartice.',
                            pattern: {
                              value: /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/,
                              message: 'Vnesite veljaven format.',
                            },
                          })}
                          onBlur={() => validateCreditCardFields()}
                          aria-invalid={
                            errors?.creditCard?.number ? 'true' : 'false'
                          }
                          className={`block w-56 rounded-lg border p-2.5 ps-10 text-sm ${getCreditCardFieldStyle(
                            'number',
                          )}`}
                          placeholder="0000-0000-0000-0000"
                        />
                      </div>
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errors?.creditCard?.number?.message}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <label
                          htmlFor="creditCardExpiration"
                          className="sr-only"
                        >
                          Datum poteka kartice:
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 text-gray-500">
                            <MdCalendarMonth />
                          </div>
                          <input
                            type="text"
                            id="creditCardExpiration"
                            {...register('creditCard.expiration', {
                              required: isCreditCardChecked && 'Vnesite datum.',
                              pattern: {
                                value: /[0-9]{2}\/[0-9]{2}/,
                                message: 'Vnesite veljaven format.',
                              },
                            })}
                            onBlur={() => validateCreditCardFields()}
                            aria-invalid={
                              errors?.creditCard?.expiration ? 'true' : 'false'
                            }
                            className={`block w-24 rounded-lg border p-2.5 ps-10 text-sm ${getCreditCardFieldStyle(
                              'expiration',
                            )}`}
                            pattern="[0-9]{2}/[0-9]{2}"
                            placeholder="12/23"
                          />
                        </div>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          {errors?.creditCard?.expiration?.message}
                        </p>
                      </div>
                      <div>
                        <label htmlFor="creditCardCVV" className="sr-only">
                          Koda CVV:
                        </label>
                        <input
                          type="number"
                          id="creditCardCVV"
                          {...register('creditCard.cvv', {
                            required: isCreditCardChecked && 'Vnesite CVV.',
                          })}
                          onBlur={() => validateCreditCardFields()}
                          aria-invalid={
                            errors?.creditCard?.cvv ? 'true' : 'false'
                          }
                          className={`block w-20 rounded-lg border p-2.5 text-sm ${getCreditCardFieldStyle(
                            'cvv',
                          )}`}
                          placeholder="CVV"
                        />
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          {errors?.creditCard?.cvv?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-xl">Opomba</h2>
            <div>
              <label
                htmlFor="note"
                className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Opomba
              </label>
              <textarea
                id="note"
                rows={4}
                {...register('note')}
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
          className={`absolute inset-y-0 right-0 z-40 transform overflow-y-auto sm:z-0 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out sm:sticky sm:top-0 sm:col-span-5 sm:translate-x-0 md:col-span-4 lg:col-span-3`}
        >
          <div className="flex h-full w-80 flex-col bg-white sm:w-auto">
            <SummarySidebar
              order={currentOrder}
              editMode={true}
              onConfirmOrder={finalizeOrder}
            />
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
