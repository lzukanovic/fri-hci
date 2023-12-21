import React from 'react';
import { Order } from '../context/OrderContext';
import { MdCreditCard, MdPayments, MdOutlineMap, MdCall } from 'react-icons/md';
import {
  getCreditCardNumberDisplay,
  getExtraToppingsTotal,
  getOrderTotal,
  getPizzaSizeText,
  getStudentDiscountCount,
  getStudentDiscountTotal,
} from '../utils/util';

interface SummarySidebarProps {
  order?: Order;
  editMode?: boolean;
}

const SummarySidebar: React.FC<SummarySidebarProps> = ({
  order,
  editMode = false,
}) => {
  const hasOrderData = () => {
    return order && (order.items.length > 0 || order.customerName);
  };

  return (
    <div className="h-full w-full overflow-y-auto border-l-[1px] border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <h1 className="mb-8 text-2xl font-semibold">Podrobnosti naročila</h1>
      {order && hasOrderData() ? (
        <>
          {/* Customer info */}
          <div className="mb-4">
            <h2 className="mb-2 text-xl">Naročnik</h2>
            <div className="font-semibold">{order.customerName}</div>
            <ul>
              <li className="mb-1 flex items-start">
                <MdOutlineMap className="mr-2 inline shrink-0 text-xl" />{' '}
                <span className="leading-5">{order.deliveryAddress}</span>
              </li>
              <li className="mb-1 flex items-center">
                {order.paymentMethod === 'cash' ? (
                  <>
                    <MdPayments className="mr-2 inline shrink-0 text-xl" />{' '}
                    <span className="leading-5">Gotovina</span>
                  </>
                ) : (
                  <>
                    <MdCreditCard className="mr-2 inline shrink-0 text-xl" />{' '}
                    <span className="leading-5">
                      {getCreditCardNumberDisplay(order)}
                    </span>
                  </>
                )}
              </li>
              <li className="flex items-center">
                <MdCall className="mr-2 inline shrink-0 text-xl" />{' '}
                <span className="leading-5">{order.phoneNumber}</span>
              </li>
            </ul>
          </div>

          {/* Order items summary */}
          <div>
            <h2 className="mb-2 text-xl">Naročilo</h2>
            <ul>
              <li className="mb-2">
                <div className="flex justify-between">
                  <span>
                    {getStudentDiscountCount(order)}x Študentski boni{' '}
                  </span>
                  <span>-{getStudentDiscountTotal(order)} €</span>
                </div>
              </li>
              {order.items.map((item, index) => (
                <li key={index} className="mb-2">
                  <div className="flex justify-between">
                    <span>
                      {item.quantity}x {item.pizza.name}
                    </span>
                    <span>{item.quantity * item.pizza.price} €</span>
                  </div>
                  <ul className="text-gray-700 dark:text-gray-400">
                    <li>Velikost: {getPizzaSizeText(item.pizza.size)}</li>
                    <li className="flex justify-between">
                      <span>
                        Dodatki:{' '}
                        {item.toppings.length > 0
                          ? item.toppings
                              .map((topping) => topping.name)
                              .join(', ')
                          : 'Brez dodatkov'}
                      </span>
                      {item.toppings.length > 0 && (
                        <span>+{getExtraToppingsTotal(item.toppings)}€</span>
                      )}
                    </li>
                    {!!item.removedToppings?.length && (
                      <li>
                        Odstrani:{' '}
                        {item.removedToppings
                          .map((topping) => topping.name)
                          .join(', ')}
                      </li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span>Znesek</span>
              <span>{getOrderTotal(order)} €</span>
            </div>
          </div>

          {/* Order statuses list for active orders */}
          {order.statuses && (
            <div className="mt-4">
              <h2 className="mb-2 text-xl">Status</h2>
              <ul>
                {order.statuses.map((status, index) => (
                  <li key={index} className="mb-2">
                    <div className="flex justify-between">
                      <span>{status.name}</span>
                      <span>{status.createdAt.toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional order note */}
          {order.note && (
            <div className="mt-4">
              <h2 className="mb-2 text-xl">Opomba</h2>
              <p>{order.note}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">
          {editMode
            ? 'Podatki o naročilu se vam bodo sproti izpisovali tukaj'
            : 'Izberite naročilo za prikaz podrobnosti'}
        </p>
      )}
    </div>
  );
};

export default SummarySidebar;
