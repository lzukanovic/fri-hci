import { Order, OrderItem, Size } from '../context/OrderContext';

export const STUDENT_DISCOUNT = -3.86;

export const PIZZA_SIZE_ADDITIONAL_PRICE: { [size in Size]: number } = {
  s: 0,
  m: 2,
  l: 4,
};

// By order item
// -------------
export const getOrderItemPizzaPrice = (item: OrderItem | null | undefined) => {
  if (!item) return 0;
  return (
    item.quantity *
    (item.pizza.basePrice + PIZZA_SIZE_ADDITIONAL_PRICE[item.pizza.size])
  );
};

export const getOrderItemToppingsPrice = (
  item: OrderItem | null | undefined,
) => {
  if (!item) return 0;
  return (
    item.quantity *
    item.addedToppings.reduce((total, topping) => total + topping.price, 0)
  );
};

const getOrderItemStudentDiscount = (item: OrderItem) => {
  return item.quantity * (item.student ? STUDENT_DISCOUNT : 0);
};

export const getOrderItemTotal = (item: OrderItem | null | undefined) => {
  if (!item) return 0;
  const pizza = getOrderItemPizzaPrice(item);
  const toppings = getOrderItemToppingsPrice(item);
  const discount = getOrderItemStudentDiscount(item);

  return pizza + toppings + discount;
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

  return pizzas + toppings + getOrderStudentDiscount(order);
};

export const getOrderStudentDiscountCount = (order: Order) => {
  if (!order) return 0;
  return order.items.reduce(
    (count, item) => count + item.quantity * (item.student ? 1 : 0),
    0,
  );
};

export const getOrderStudentDiscount = (order: Order) => {
  return getOrderStudentDiscountCount(order) * STUDENT_DISCOUNT;
};
