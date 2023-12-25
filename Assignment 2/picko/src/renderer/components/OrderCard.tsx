import React from 'react';
import { Order, StatusType } from '../context/OrderContext';
import { getOrderStudentDiscountCount } from '../utils/order.util';
import {
  getPizzaNameDisplay,
  getPizzaSizeText,
  getStatusNameDisplay,
  getToppingNameDisplay,
} from '../utils/display.util';
import {
  MdOutlineLocalPizza,
  MdAddCircleOutline,
  MdOutlineRemoveCircleOutline,
  MdCircle,
  MdMoreVert,
} from 'react-icons/md';
import dayjs from 'dayjs';
import 'dayjs/locale/sl';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('sl');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onClick: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onClick,
}) => {
  const isOrderFinished =
    order.statuses?.[order.statuses.length - 1].name === 'delivered';

  const getCardColor = () => {
    if (isSelected) {
      return 'border-blue-500 bg-blue-50 hover:border-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-700 dark:bg-opacity-10 dark:hover:border-blue-400 dark:hover:bg-blue-700 dark:hover:bg-opacity-30';
    } else {
      return 'border-gray-300 bg-white hover:border-gray-700 hover:bg-gray-100 hover:bg-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-400 dark:hover:bg-gray-700';
    }
  };
  const getLastStatusColor = (status: StatusType) => {
    switch (status) {
      case 'created':
      case 'preparation':
      case 'prepared':
      case 'delivery':
        return 'text-blue-500';
      case 'delivered':
        return 'text-green-500';
      case 'canceled':
        return 'text-red-500';
      default:
        return 'text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div
      onClick={() => onClick(order)}
      // className="relative grid w-full grid-cols-12 rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-3 transition-colors hover:cursor-pointer hover:border-gray-700 hover:bg-gray-100 hover:bg-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-400 dark:hover:bg-gray-700"
      className={`relative grid w-full grid-cols-12 rounded-lg border py-3 pl-6 pr-3 transition-colors hover:cursor-pointer ${getCardColor()}`}
    >
      {/* Order Details */}
      <div className="col-span-9 pr-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {order.customerName}
        </h2>
        <div className="font-normal text-gray-900 dark:text-white">
          {order.deliveryAddress}
        </div>
        <ul>
          <li className="font-normal text-gray-700 dark:text-gray-400">
            - {getOrderStudentDiscountCount(order)}x Študentski boni
          </li>
          {order.items.map((item, index) => (
            <li
              key={index}
              className="font-normal text-gray-700 dark:text-gray-400"
            >
              <div>
                - {item.quantity}x {getPizzaNameDisplay(item.pizza.name)}
              </div>
              <div className="ml-3 flex flex-wrap gap-x-2">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <MdOutlineLocalPizza className="inline" />{' '}
                  {getPizzaSizeText(item.pizza.size)}
                </span>
                {!!item.removedToppings?.length && (
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <MdOutlineRemoveCircleOutline className="inline" />{' '}
                    {item.removedToppings
                      ?.map((topping) => getToppingNameDisplay(topping.name))
                      .join(', ')}
                  </span>
                )}
                {!!item.addedToppings?.length && (
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <MdAddCircleOutline className="inline" />{' '}
                    {item.addedToppings
                      .map((topping) =>
                        getToppingNameDisplay(
                          topping.name,
                          topping.customDisplayName,
                        ),
                      )
                      .join(', ')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Status */}
      {/* if only one */}
      {order.statuses && order.statuses.length === 1 && (
        <div className="col-span-3 flex flex-col items-end text-sm text-gray-700 dark:text-gray-400">
          <div className="flex items-start justify-end space-x-2">
            <div className="text-right">
              <div
                className={`whitespace-nowrap leading-4 ${getLastStatusColor(
                  order.statuses[0].name,
                )}`}
              >
                {getStatusNameDisplay(order.statuses[0].name)}
              </div>
              <div className="text-xs">
                {isOrderFinished
                  ? dayjs(order.statuses[0].createdAt).format('lll')
                  : dayjs(order.statuses[0].createdAt).fromNow()}
              </div>
            </div>
            <MdCircle
              className={`h-4 w-4 shrink-0 ${getLastStatusColor(
                order.statuses[0].name,
              )}`}
            />
          </div>
        </div>
      )}
      {/* if more than one */}
      {order.statuses && order.statuses.length > 1 && (
        <div className="col-span-3 flex flex-col items-end text-sm text-gray-700 dark:text-gray-400">
          {/* Last Status */}
          <div className="flex grow items-start justify-end space-x-2">
            <div className="text-right">
              <div
                className={`whitespace-nowrap leading-4 ${getLastStatusColor(
                  order.statuses[order.statuses.length - 1].name,
                )}`}
              >
                {getStatusNameDisplay(
                  order.statuses[order.statuses.length - 1].name,
                )}
              </div>
              <div className="text-xs">
                {isOrderFinished
                  ? dayjs(
                      order.statuses[order.statuses.length - 1].createdAt,
                    ).format('lll')
                  : dayjs(
                      order.statuses[order.statuses.length - 1].createdAt,
                    ).fromNow()}
              </div>
            </div>
            <div className="relative flex h-full flex-col items-center">
              <MdCircle
                className={`z-10 h-4 w-4 shrink-0 ${getLastStatusColor(
                  order.statuses[order.statuses.length - 1].name,
                )}`}
              />
              <div className="-mt-1 h-full w-[1px] bg-gray-700 dark:bg-gray-400"></div>
            </div>
          </div>

          <MdMoreVert className="my-2 h-4 w-4 shrink-0" />

          {/* First Status */}
          <div className="flex grow items-end justify-end space-x-2">
            <div className="text-right">
              <div className="whitespace-nowrap leading-4">
                {getStatusNameDisplay(order.statuses[0].name)}
              </div>
              <div className="text-xs">
                {isOrderFinished
                  ? dayjs(order.statuses[0].createdAt).format('lll')
                  : dayjs(order.statuses[0].createdAt).fromNow()}
              </div>
            </div>
            <div className="relative flex h-full flex-col items-center">
              <div className="-mb-1 h-full w-[1px] bg-gray-700 dark:bg-gray-400"></div>
              <MdCircle className="h-4 w-4 shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
