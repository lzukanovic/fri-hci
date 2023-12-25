import { round } from 'lodash';
import { Order, OrderItem, Size } from '../context/OrderContext';

export const STUDENT_DISCOUNT = -3.86;

const PIZZA_CREATE_TIME_MIN = 20;

export const PIZZA_SIZE_ADDITIONAL_PRICE: { [size in Size]: number } = {
  s: 0,
  m: 2,
  l: 4,
};

export const getEstimatedDeliveryTimeMinutes = (order: Order) => {
  if (!order) return 0;
  const pizzas = order.items.reduce((total, item) => total + item.quantity, 0);
  return round(pizzas * PIZZA_CREATE_TIME_MIN, 2);
};

// By order item
// -------------
export const getOrderItemPizzaPrice = (item: OrderItem | null | undefined) => {
  if (!item) return 0;
  return round(
    item.quantity *
      (item.pizza.basePrice + PIZZA_SIZE_ADDITIONAL_PRICE[item.pizza.size]),
    2,
  );
};

export const getOrderItemToppingsPrice = (
  item: OrderItem | null | undefined,
) => {
  if (!item) return 0;
  return round(
    item.quantity *
      item.addedToppings.reduce((total, topping) => total + topping.price, 0),
    2,
  );
};

const getOrderItemStudentDiscount = (item: OrderItem) => {
  return round(item.quantity * (item.student ? STUDENT_DISCOUNT : 0), 2);
};

export const getOrderItemTotal = (item: OrderItem | null | undefined) => {
  if (!item) return 0;
  const pizza = getOrderItemPizzaPrice(item);
  const toppings = getOrderItemToppingsPrice(item);
  const discount = getOrderItemStudentDiscount(item);

  return round(pizza + toppings + discount, 2);
};

// By order
// --------
export const getOrderTotal = (order: Order) => {
  if (!order) return 0;
  const pizzas = order.items.reduce(
    (total, item) => total + getOrderItemPizzaPrice(item),
    0,
  );
  const toppings = order.items.reduce(
    (total, item) => total + getOrderItemToppingsPrice(item),
    0,
  );

  return round(pizzas + toppings + getOrderStudentDiscount(order), 2);
};

export const getOrderStudentDiscountCount = (order: Order) => {
  if (!order) return 0;
  return order.items.reduce(
    (count, item) => count + item.quantity * (item.student ? 1 : 0),
    0,
  );
};

export const getOrderStudentDiscount = (order: Order) => {
  return round(getOrderStudentDiscountCount(order) * STUDENT_DISCOUNT, 2);
};
