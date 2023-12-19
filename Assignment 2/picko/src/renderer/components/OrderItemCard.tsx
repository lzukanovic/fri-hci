import React from 'react';
import { OrderItem } from '../context/OrderContext';
import { MdContentCopy, MdEdit, MdDelete } from 'react-icons/md';
import { getOrderItemTotal, getPizzaSizeText } from '../utils/util';

interface OrderItemCardProps {
  item: OrderItem;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
  return (
    <div className="relative block w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-3 dark:border-gray-700 dark:bg-gray-800">
      <span className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
      <div className="font-normal text-gray-700 dark:text-gray-400">
        Velikost: {getPizzaSizeText(item.pizza.size)}
      </div>
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
      {item.student && (
        <div className="font-normal text-gray-700 dark:text-gray-400">
          Študentski boni: Da
        </div>
      )}
      <div className="flex justify-end text-lg font-semibold text-gray-900 dark:text-white">
        {getOrderItemTotal(item)} €
      </div>
    </div>
  );
};

export default OrderItemCard;
