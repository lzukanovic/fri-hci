import React from 'react';
import { Order } from '../context/OrderContext';
import {
  MdCreditCard,
  MdPayments,
  MdOutlineMap,
  MdCall,
  MdOutlineQueryBuilder,
  MdCircle,
} from 'react-icons/md';
import {
  getOrderItemPizzaPrice,
  getOrderItemToppingsPrice,
  getOrderTotal,
  getOrderStudentDiscountCount,
  getOrderStudentDiscount,
  getEstimatedDeliveryTimeMinutes,
} from '../utils/order.util';
import {
  getCreditCardNumberDisplay,
  getPizzaNameDisplay,
  getPizzaSizeText,
  getPriceDifferenceDisplay,
  getStatusNameDisplay,
  getToppingNameDisplay,
} from '../utils/display.util';
import dayjs from 'dayjs';
import 'dayjs/locale/sl';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('sl');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface SummarySidebarProps {
  order?: Order;
  editMode?: boolean;
  onConfirmOrder?: () => void;
  onCancelOrder?: () => void;
}

const SummarySidebar: React.FC<SummarySidebarProps> = ({
  order,
  editMode = false,
  onConfirmOrder,
  onCancelOrder,
}) => {
  const hasOrderData = () => {
    return order && (order.items.length > 0 || order.customerName);
  };
  const isNotDeliveredOrCanceled = () => {
    return (
      order &&
      order.statuses &&
      order.statuses[order.statuses.length - 1].name !== 'delivered' &&
      order.statuses[order.statuses.length - 1].name !== 'canceled'
    );
  };
  const isNotInDeliveryOrCanceled = () => {
    return (
      order &&
      order.statuses &&
      isNotDeliveredOrCanceled() &&
      order.statuses[order.statuses.length - 1].name !== 'delivery'
    );
  };
  const getAbsoluteEstimatedDeliveryTime = (order: Order) => {
    if (order.statuses && order.statuses.length > 0) {
      const createdStatus = order.statuses[0];
      const estimatedMinutes = getEstimatedDeliveryTimeMinutes(order);
      return dayjs(createdStatus.createdAt)
        .add(estimatedMinutes, 'minute')
        .format('LT');
    }
    return 'N/A';
  };
  const getMinutesUntilEstimatedDelivery = (order: Order) => {
    if (order.statuses && order.statuses.length > 0) {
      const createdStatus = order.statuses[0];
      const estimatedMinutes = getEstimatedDeliveryTimeMinutes(order);
      const estimatedDeliveryTime = dayjs(createdStatus.createdAt).add(
        estimatedMinutes,
        'minute',
      );
      return estimatedDeliveryTime.diff(dayjs(), 'minute');
    }
    return 0;
  };
  const getDeliveryTimeMessage = (order: Order) => {
    if (order.statuses && order.statuses.length > 0) {
      const createdStatus = order.statuses[0];
      const estimatedMinutes = getEstimatedDeliveryTimeMinutes(order);
      const estimatedDeliveryTime = dayjs(createdStatus.createdAt).add(
        estimatedMinutes,
        'minute',
      );
      const remainingMinutes = estimatedDeliveryTime.diff(dayjs(), 'minute');

      if (remainingMinutes < 0) {
        // Delivery is overdue
        return `Zamuda pri dostavi (več kot ${-remainingMinutes} min)`;
      } else {
        // Delivery is within the estimated time
        return `Predviden čas dostave: ${estimatedDeliveryTime.format(
          'LT',
        )} (še ${remainingMinutes} min)`;
      }
    }
    return 'N/A';
  };

  return (
    <>
      <div className="flex-grow space-y-6 overflow-y-auto border-l-[1px] border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        <h1 className="text-2xl font-semibold">Podrobnosti naročila</h1>
        {order && hasOrderData() ? (
          <>
            {/* Customer info */}
            <div>
              <h2 className="mb-2 text-xl">Naročnik</h2>
              <div className="font-semibold">{order.customerName}</div>
              <ul>
                {!!order.deliveryAddress && (
                  <li className="mb-1 flex items-start">
                    <MdOutlineMap className="mr-2 inline shrink-0 text-xl" />{' '}
                    <span className="leading-5">{order.deliveryAddress}</span>
                  </li>
                )}

                {!!order.paymentMethod && (
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
                )}

                {!!order.phoneNumber && (
                  <li className="flex items-center">
                    <MdCall className="mr-2 inline shrink-0 text-xl" />{' '}
                    <span className="leading-5">{order.phoneNumber}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Order items summary */}
            <div>
              <h2 className="mb-2 text-xl">Naročilo</h2>
              {order.items.length > 0 ? (
                <>
                  <ul>
                    {getOrderStudentDiscountCount(order) > 0 && (
                      <li className="mb-2">
                        <div className="flex justify-between">
                          <span>
                            {getOrderStudentDiscountCount(order)}x Študentski
                            boni{' '}
                          </span>
                          <span>{getOrderStudentDiscount(order)} €</span>
                        </div>
                      </li>
                    )}

                    {order.items.map((item, index) => (
                      <li key={index} className="mb-2">
                        <div className="flex justify-between">
                          <span>
                            {item.quantity}x{' '}
                            {getPizzaNameDisplay(item.pizza.name)}
                          </span>
                          <span>{getOrderItemPizzaPrice(item)} €</span>
                        </div>
                        <ul className="text-gray-700 dark:text-gray-400">
                          <li>Velikost: {getPizzaSizeText(item.pizza.size)}</li>
                          {!!item.removedToppings?.length && (
                            <li>
                              Odstrani:{' '}
                              {item.removedToppings
                                .map((topping) =>
                                  getToppingNameDisplay(topping.name),
                                )
                                .join(', ')}
                            </li>
                          )}
                          <li className="flex justify-between">
                            <span>
                              Dodatki:{' '}
                              {item.addedToppings.length > 0
                                ? item.addedToppings
                                    .map((addedToppings) =>
                                      getToppingNameDisplay(
                                        addedToppings.name,
                                        addedToppings.customDisplayName,
                                      ),
                                    )
                                    .join(', ')
                                : 'Brez dodatkov'}
                            </span>
                            {item.addedToppings.length > 0 && (
                              <span>
                                {getPriceDifferenceDisplay(
                                  getOrderItemToppingsPrice(item),
                                )}
                                €
                              </span>
                            )}
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span>Znesek</span>
                    <span>{getOrderTotal(order)} €</span>
                  </div>
                </>
              ) : (
                <p className="-mt-2 text-gray-500">Naročilo je prazno.</p>
              )}
            </div>

            {/* Order statuses list for active orders */}
            {order.statuses && (
              <div>
                <h2 className="text-xl">Status</h2>
                {isNotDeliveredOrCanceled() && (
                  <p className="text-gray-700 dark:text-gray-400">
                    {getDeliveryTimeMessage(order)}
                  </p>
                )}
                {/* <ul className="mt-2 space-y-1">
                  {order.statuses
                    .slice()
                    .reverse()
                    .map((status, index, arr) => {
                      let timeDifferenceInMinutes = '';

                      if (order.statuses && index < arr.length - 1) {
                        const nextStatus = arr[index + 1];
                        const diffMinutes = dayjs(status.createdAt).diff(
                          dayjs(nextStatus.createdAt),
                          'minute',
                        );
                        timeDifferenceInMinutes = `${diffMinutes}'`;
                      }

                      return (
                        <>
                          <li key={index}>
                            <div className="flex justify-between">
                              <span>{getStatusNameDisplay(status.name)}</span>
                              <span className="text-gray-700 dark:text-gray-400">
                                {index === 0
                                  ? dayjs(status.createdAt).format('lll')
                                  : dayjs(status.createdAt).format('LT')}
                              </span>
                            </div>
                          </li>
                          {index < arr.length - 1 && (
                            <li key={arr.length + index}>
                              <span className="inline-flex items-center rounded border border-gray-500 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-400 ">
                                <MdOutlineQueryBuilder className="me-1.5 h-2.5 w-2.5" />
                                {timeDifferenceInMinutes}
                              </span>
                            </li>
                          )}
                        </>
                      );
                    })}
                </ul> */}

                <ol className="relative mt-2 border-s border-gray-200 dark:border-gray-700">
                  {order.statuses
                    .slice()
                    .reverse()
                    .map((status, index, arr) => {
                      let timeDifferenceInMinutes = '';

                      if (order.statuses && index > 0) {
                        const previousStatus = arr[index - 1];
                        const diffMinutes = dayjs(
                          previousStatus.createdAt,
                        ).diff(dayjs(status.createdAt), 'minute');
                        timeDifferenceInMinutes = `${diffMinutes}'`;
                      }

                      return (
                        <>
                          <li key={index} className="mb-6 ms-4">
                            <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                            <h3 className="mb-1 flex items-center text-gray-900 dark:text-white">
                              {getStatusNameDisplay(status.name)}
                            </h3>
                            <time className="mb-2 block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                              {dayjs(status.createdAt).format('lll')}
                            </time>
                            {/* Display the time it took to complete this status */}
                            {index > 0 && (
                              <span className="inline-flex items-center rounded border border-gray-500 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-400 ">
                                <MdOutlineQueryBuilder className="me-1.5 h-2.5 w-2.5" />
                                {timeDifferenceInMinutes}
                              </span>
                            )}
                          </li>
                        </>
                      );
                    })}
                </ol>
              </div>
            )}

            {/* Optional order note */}
            {order.note && (
              <div>
                <h2 className="text-xl">Opomba</h2>
                <p className="text-gray-700 dark:text-gray-400">{order.note}</p>
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
      {/* Confirm Order */}
      {order && hasOrderData() && editMode && (
        <div className="z-10 border-l-[1px] border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          {order.items.length > 0 && (
            <p className="mb-2 text-center text-sm text-gray-500">
              Predviden čas dostave: {getEstimatedDeliveryTimeMinutes(order)}{' '}
              min
            </p>
          )}
          <button
            onClick={onConfirmOrder}
            className="w-full whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Zaključi naročilo
          </button>
        </div>
      )}
      {/* Cancel Order */}
      {order && hasOrderData() && !editMode && isNotInDeliveryOrCanceled() && (
        <div className="z-10 border-l-[1px] border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={onCancelOrder}
            className="w-full whitespace-nowrap rounded-md bg-red-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Prekliči naročilo
          </button>
        </div>
      )}
    </>
  );
};

export default SummarySidebar;
