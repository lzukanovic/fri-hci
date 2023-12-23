import { Modal } from 'flowbite-react';
import {
  DefaultTopping,
  OrderItem,
  Pizza,
  PizzaType,
  Size,
  Topping,
} from '../context/OrderContext';
import { FormEvent, useEffect, useState } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import {
  PIZZA_SIZE_ADDITIONAL_PRICE,
  STUDENT_DISCOUNT,
  getOrderItemTotal,
} from '../utils/order.util';
import {
  getPizzaNameDisplay,
  getPriceDifferenceDisplay,
  getToppingNameDisplay,
} from '../utils/display.util';
import {
  DEFAULT_PIZZAS,
  DEFAULT_PIZZA_DICTIONARY,
} from '../constants/pizza.constant';
import { DEFAULT_TOPPINGS } from '../constants/topping.constant';
import { NIL } from 'uuid';

interface OrderItemModalProps {
  item: OrderItem | null | undefined;
  show: boolean;
  onClose: (updatedItem?: OrderItem) => void;
}

const OrderItemModal: React.FC<OrderItemModalProps> = ({
  item,
  show,
  onClose,
}) => {
  // Current item state
  const [currentItem, setCurrentItem] = useState<OrderItem | undefined>(
    item || undefined,
  );
  // Order item state
  const [pizza, setPizza] = useState<PizzaType>(
    item?.pizza.name || 'margarita',
  );
  const [pizzaSize, setPizzaSize] = useState<Size>(item?.pizza.size || 's');
  const [studentDiscount, setStudentDiscount] = useState<boolean>(
    item?.student || false,
  );
  const [quantity, setQuantity] = useState<number>(item?.quantity || 1);

  const [availableToppingsToRemove, setAvailableToppingsToRemove] = useState<
    DefaultTopping[]
  >(DEFAULT_PIZZA_DICTIONARY[item?.pizza.name ?? '']?.defaultToppings || []);
  const [removedToppings, setRemovedToppings] = useState<DefaultTopping[]>([]);
  const [availableToppingsToAdd, setAvailableToppingsToAdd] =
    useState<Topping[]>(DEFAULT_TOPPINGS);
  const [addedToppings, setAddedToppings] = useState<Topping[]>([]);

  const isNewItem = !item;

  // Custom topping
  const [customToppingName, setCustomToppingName] = useState('');
  const [customToppingPrice, setCustomToppingPrice] = useState(0);
  const [customToppingValid, setCustomToppingValid] = useState<boolean>(true);

  const addNewCustomTopping = (event: FormEvent) => {
    event.preventDefault();
    // validate custom topping
    // only name is needed, the price is required and can be any number
    if (!customToppingName) {
      setCustomToppingValid(false);
      return;
    }
    setCustomToppingValid(true);

    // parse custom topping name, remove spaces and join with dashes
    const customToppingNameParsed = customToppingName
      .trim()
      .split(' ')
      .join('-')
      .toLowerCase();
    const newTopping: Topping = {
      name: customToppingNameParsed,
      customDisplayName: customToppingName,
      price: customToppingPrice,
    };
    // Add topping to available toppings to add
    setAvailableToppingsToAdd([...availableToppingsToAdd, newTopping]);
    // Add topping to added toppings
    setAddedToppings([...addedToppings, newTopping]);
    // Reset custom topping fields
    setCustomToppingName('');
    setCustomToppingPrice(0);
  };

  const getCustomToppingInputValidationClass = () => {
    if (!customToppingValid) {
      return 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400';
    } else {
      return 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500';
    }
  };

  const resetCustomToppingForm = () => {
    setCustomToppingName('');
    setCustomToppingPrice(0);
    setCustomToppingValid(true);
  };

  // Form handlers
  const decrementQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };
  const incrementQuantity = () => {
    setQuantity(Math.min(99, quantity + 1));
  };
  const manuallySetQuantity = (newQuantity: number) => {
    setQuantity(Math.min(99, Math.max(1, newQuantity)));
  };
  const checkIfToppingChecked = (
    topping: Topping | DefaultTopping,
    event: 'add' | 'remove',
  ) => {
    if (event === 'add') {
      return !!addedToppings.find(
        (addedTopping) => addedTopping.name === topping.name,
      );
    } else {
      return !!removedToppings.find(
        (removedTopping) => removedTopping.name === topping.name,
      );
    }
  };
  const handleToppingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    topping: Topping | DefaultTopping,
    event: 'add' | 'remove',
  ) => {
    if (e.target.checked) {
      if (event === 'add') {
        setAddedToppings([...addedToppings, topping as Topping]);
      } else {
        setRemovedToppings([...removedToppings, topping as DefaultTopping]);
      }
    } else {
      if (event === 'add') {
        setAddedToppings(
          addedToppings.filter(
            (addedTopping) => addedTopping.name !== topping.name,
          ),
        );
      } else {
        setRemovedToppings(
          removedToppings.filter(
            (removedTopping) => removedTopping.name !== topping.name,
          ),
        );
      }
    }
  };

  // Handlers
  const onCloseModal = (save: boolean = false) => {
    // reset state
    resetForm();

    // callback
    if (save) {
      onClose(currentItem);
    } else {
      onClose();
    }
  };

  const resetForm = () => {
    setPizza('margarita');
    setPizzaSize('s');
    setStudentDiscount(false);
    setQuantity(1);
    setRemovedToppings([]);
    setAddedToppings([]);
    setCustomToppingName('');
    setCustomToppingPrice(0);
  };

  const updateAvailableToppingsToRemove = () => {
    const defaultToppings: DefaultTopping[] =
      DEFAULT_PIZZA_DICTIONARY[pizza].defaultToppings || [];
    setAvailableToppingsToRemove(defaultToppings);
  };

  // Update form controls when item changes
  useEffect(() => {
    if (item) {
      setPizza(item.pizza.name || '');
      setPizzaSize(item.pizza.size || 's');
      setStudentDiscount(item.student || false);
      setQuantity(item.quantity || 1);
      setRemovedToppings(item.removedToppings || []);
      setAddedToppings(item.addedToppings || []);
      updateAvailableToppingsToRemove();
    }
    updateAvailableToppingsToRemove();
    return;
  }, [item]);

  // Compute current item state in the modal
  useEffect(() => {
    updateAvailableToppingsToRemove();

    const defaultPizza: Pizza =
      DEFAULT_PIZZAS.find((p) => p.name === pizza) || DEFAULT_PIZZAS[0];
    const currentPizza: Pizza = {
      name: pizza,
      basePrice: defaultPizza.basePrice,
      size: pizzaSize,
      defaultToppings: defaultPizza.defaultToppings,
    };

    setCurrentItem({
      id: item?.id || NIL,
      pizza: currentPizza,
      removedToppings,
      addedToppings,
      quantity,
      student: studentDiscount,
    });
  }, [
    pizza,
    pizzaSize,
    studentDiscount,
    quantity,
    removedToppings,
    addedToppings,
  ]);

  return (
    <Modal show={show} size="xl" onClose={onCloseModal} popup>
      <Modal.Header className="p-4 md:p-5">
        <div className="text-xl font-semibold text-gray-900 dark:text-white">
          {isNewItem ? 'Dodaj' : 'Uredi'} izdelek
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {/* Pizza */}
          <div>
            <label
              htmlFor="pizzas"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Izberite pico
            </label>
            <select
              id="pizzas"
              value={pizza}
              onChange={(e) => setPizza(e.target.value as PizzaType)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              {DEFAULT_PIZZAS.map((pizza) => (
                <option key={pizza.name} value={pizza.name}>
                  {getPizzaNameDisplay(pizza.name)} - {pizza.basePrice}€
                </option>
              ))}
            </select>
          </div>
          {/* Removed Toppings */}
          <div>
            <div className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Odstrani
            </div>
            <div className="space-y-2">
              {availableToppingsToRemove.map((topping, index) => (
                <div key={`${topping}-${index}`} className="flex items-center">
                  <input
                    id={`remove-${topping.name}`}
                    type="checkbox"
                    value={topping.name}
                    checked={checkIfToppingChecked(topping, 'remove')}
                    onChange={(e) => handleToppingChange(e, topping, 'remove')}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor={`remove-${topping.name}`}
                    className="ms-2 space-x-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>{getToppingNameDisplay(topping.name)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Added Toppings */}
          <div>
            <div className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Dodaj
            </div>
            <div className="space-y-2">
              {availableToppingsToAdd.map((topping, index) => (
                <div key={`${topping}-${index}`} className="flex items-center">
                  <input
                    id={`add-${topping.name}`}
                    type="checkbox"
                    value={topping.name}
                    checked={checkIfToppingChecked(topping, 'add')}
                    onChange={(e) => handleToppingChange(e, topping, 'add')}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor={`add-${topping.name}`}
                    className="ms-2 space-x-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>
                      {getToppingNameDisplay(
                        topping.name,
                        topping.customDisplayName,
                      )}
                    </span>
                    <span className="text-gray-700 dark:text-gray-400">
                      {getPriceDifferenceDisplay(topping.price)}€
                    </span>
                  </label>
                </div>
              ))}
            </div>
            {/* Component to add custom toppings */}
            <div className="mt-3">
              <div className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Nov dodatek
              </div>
              <form onSubmit={addNewCustomTopping}>
                <div className="flex flex-wrap gap-2">
                  <div>
                    <label htmlFor="customToppingName" className="sr-only">
                      Ime:
                    </label>
                    <input
                      type="text"
                      id="customToppingName"
                      value={customToppingName}
                      onChange={(e) => setCustomToppingName(e.target.value)}
                      className={`block w-28 rounded-lg border p-2 text-sm ${getCustomToppingInputValidationClass()}}`}
                      placeholder="Ime dodatka"
                    />
                  </div>
                  <div>
                    <label htmlFor="customToppingPrice" className="sr-only">
                      Cena:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="customToppingPrice"
                        value={customToppingPrice}
                        onChange={(e) => setCustomToppingPrice(+e.target.value)}
                        className={`block w-24 rounded-lg border p-2 pe-6 text-sm ${getCustomToppingInputValidationClass()}}`}
                        placeholder="0"
                      />
                      <span
                        className={`absolute end-0 top-0 h-full p-2.5 text-sm font-medium ${
                          customToppingValid
                            ? 'text-gray-900 dark:text-white'
                            : 'text-red-900'
                        }`}
                      >
                        €
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-2 text-sm text-gray-900 underline-offset-2 hover:underline dark:text-white"
                  >
                    Dodaj
                  </button>
                  <button
                    type="button"
                    onClick={() => resetCustomToppingForm()}
                    className="py-2 text-sm text-gray-900 underline-offset-2 hover:underline dark:text-white"
                  >
                    Počisti
                  </button>
                </div>
                {!customToppingValid && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    Vnesite ime in ceno dodatka!
                  </p>
                )}
              </form>
            </div>
          </div>
          {/* Size */}
          <div>
            <div className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Velikost
            </div>
            <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
              <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                <div className="flex items-center ps-3">
                  <input
                    id="pizzaSizeSmall"
                    type="radio"
                    value="s"
                    name="pizzaSize"
                    checked={pizzaSize === 's'}
                    onChange={(e) => setPizzaSize(e.target.value as Size)}
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor="pizzaSizeSmall"
                    className="ms-2 w-full space-x-2 py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>Mala</span>
                    <span className="text-gray-700 dark:text-gray-400">
                      {getPriceDifferenceDisplay(
                        PIZZA_SIZE_ADDITIONAL_PRICE['s'],
                      )}
                      €
                    </span>
                  </label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                <div className="flex items-center ps-3">
                  <input
                    id="pizzaSizeMedium"
                    type="radio"
                    value="m"
                    name="pizzaSize"
                    checked={pizzaSize === 'm'}
                    onChange={(e) => setPizzaSize(e.target.value as Size)}
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor="pizzaSizeMedium"
                    className="ms-2 w-full space-x-2 py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>Srednja</span>
                    <span className="text-gray-700 dark:text-gray-400">
                      {getPriceDifferenceDisplay(
                        PIZZA_SIZE_ADDITIONAL_PRICE['m'],
                      )}
                      €
                    </span>
                  </label>
                </div>
              </li>
              <li className="w-full dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    id="pizzaSizeLarge"
                    type="radio"
                    value="l"
                    name="pizzaSize"
                    checked={pizzaSize === 'l'}
                    onChange={(e) => setPizzaSize(e.target.value as Size)}
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor="pizzaSizeLarge"
                    className="ms-2 w-full space-x-2 py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>Velika</span>
                    <span className="text-gray-700 dark:text-gray-400">
                      {getPriceDifferenceDisplay(
                        PIZZA_SIZE_ADDITIONAL_PRICE['l'],
                      )}
                      €
                    </span>
                  </label>
                </div>
              </li>
            </ul>
          </div>
          {/* Student Discount */}
          <div>
            <div className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Študentski bon
            </div>
            <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
              <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                <div className="flex items-center ps-3">
                  <input
                    id="studentDiscountNo"
                    type="radio"
                    value="false"
                    name="studentDiscount"
                    checked={!studentDiscount}
                    onChange={(e) =>
                      setStudentDiscount(e.target.value === 'true')
                    }
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor="studentDiscountNo"
                    className="ms-2 w-full space-x-2 py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>Ne</span>
                  </label>
                </div>
              </li>
              <li className="w-full dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    id="studentDiscountYes"
                    type="radio"
                    value="true"
                    name="studentDiscount"
                    checked={studentDiscount}
                    onChange={(e) =>
                      setStudentDiscount(e.target.value === 'true')
                    }
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                  />
                  <label
                    htmlFor="studentDiscountYes"
                    className="ms-2 w-full space-x-2 py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    <span>Da</span>
                    <span className="text-green-700 dark:text-green-400">
                      {STUDENT_DISCOUNT}€
                    </span>
                  </label>
                </div>
              </li>
            </ul>
          </div>
          {/* Quantity */}
          <div>
            <label
              htmlFor="orderItemQuantity"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Količina:
            </label>
            <div className="relative flex max-w-[8rem] items-center">
              <button
                type="button"
                onClick={decrementQuantity}
                className="h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <MdRemove className="text-gray-900 dark:text-white" />
              </button>
              <input
                type="text"
                id="orderItemQuantity"
                value={quantity}
                onChange={(e) => manuallySetQuantity(+e.target.value)}
                className="block h-11 w-full border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                aria-describedby="quantityHelperText"
                required
              />
              <button
                type="button"
                onClick={incrementQuantity}
                className="h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <MdAdd className="text-gray-900 dark:text-white" />
              </button>
            </div>
            <p
              id="quantityHelperText"
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
              Količina podvoji celotno naročilo pice, vključno z velikostjo,
              dodatki in študentskim bonom.
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-between p-4 md:p-5">
        <div className="text-gray-900 dark:text-white">
          Znesek:{' '}
          <span className="font-semibold">
            {getOrderItemTotal(currentItem)} €
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onCloseModal()}
            className="font-medium text-blue-500 hover:underline"
          >
            Prekliči
          </button>
          <button
            onClick={() => onCloseModal(true)}
            className="block rounded-md bg-blue-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {isNewItem ? 'Dodaj' : 'Posodobi'} izdelek
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderItemModal;
