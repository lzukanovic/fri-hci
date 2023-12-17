import React from 'react';
import { OrderItem, Size } from '../context/OrderContext';
import { MdContentCopy, MdEdit, MdDelete } from 'react-icons/md';

interface OrderItemCardProps {
  item: OrderItem;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
  const getSizeText = (size: Size | undefined) => {
    switch (size) {
      case 's':
        return 'Mala';
      case 'm':
        return 'Srednja';
      case 'l':
        return 'Velika';
      default:
        return 'Mala';
    }
  };

  return (
    <div className="block w-full rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <span className="mb-1 flex items-center justify-between">
        <h3 className="text-l font-semibold text-gray-900 dark:text-white">
          {item.quantity}x {item.pizza.name}
        </h3>
        {/* Header Buttons */}
        <span className="flex items-center">
          <button
            type="button"
            className="me-2 inline-flex items-center rounded-lg border border-transparent p-2.5 text-center font-medium hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            <MdContentCopy />
            <span className="sr-only">Podvojite izdelek</span>
          </button>
          <button
            type="button"
            className="me-2 inline-flex items-center rounded-lg border border-transparent p-2.5 text-center font-medium hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            <MdEdit />
            <span className="sr-only">Uredite izdelek</span>
          </button>
          <button
            type="button"
            className="me-2 inline-flex items-center rounded-lg border border-transparent p-2.5 text-center font-medium hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            <MdDelete />
            <span className="sr-only">Odstranite izdelek</span>
          </button>
        </span>
      </span>
      {!!item.removedToppings?.length && (
        <div className="font-normal text-gray-700 dark:text-gray-400">
          Odstrani:{' '}
          {item.removedToppings.map((topping) => topping.name).join(', ')}
        </div>
      )}
      <div className="font-normal text-gray-700 dark:text-gray-400">
        Dodatki:{' '}
        {item.toppings.length > 0
          ? item.toppings.map((topping) => topping.name).join(', ')
          : 'Brez dodatkov'}
      </div>
      <div className="font-normal text-gray-700 dark:text-gray-400">
        Velikost: {getSizeText(item.pizza.size)}
      </div>
      {item.pizza.student && (
        <div className="font-normal text-gray-700 dark:text-gray-400">
          Študentski boni: Da
        </div>
      )}
    </div>
  );
};

export default OrderItemCard;
