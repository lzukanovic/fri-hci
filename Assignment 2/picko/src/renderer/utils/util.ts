import { Order, OrderItem, Size, Topping } from '../context/OrderContext';

const STUDENT_DISCOUNT = 3.86;

export const getPizzaSizeText = (size: Size | undefined) => {
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

export const getStudentDiscountCount = (order: Order) => {
  if (!order) return 0;
  return order.items.filter((item) => item.student).length;
};

export const getStudentDiscountTotal = (order: Order) => {
  return getStudentDiscountCount(order) * STUDENT_DISCOUNT;
};

export const getExtraToppingsTotal = (toppings: Topping[]) => {
  return toppings.reduce((total, topping) => total + topping.price, 0);
};

export const getOrderTotal = (order: Order) => {
  if (!order) return 0;
  const pizzas = order.items.reduce(
    (total, item) => total + item.quantity * item.pizza.price,
    0,
  );
  const toppings = order.items.reduce(
    (total, item) =>
      total +
      item.toppings.reduce((total, topping) => total + topping.price, 0),
    0,
  );

  return pizzas + toppings - getStudentDiscountTotal(order);
};

export const getCreditCardNumberDisplay = (order: Order) => {
  if (!order?.creditCardNumber) return '';
  const lastFourDigits = order.creditCardNumber.slice(-4);
  return `**** **** **** ${lastFourDigits}`;
};

export const getOrderItemTotal = (item: OrderItem) => {
  if (!item) return 0;
  const pizza = item.quantity * item.pizza.price;
  const toppings = item.toppings.reduce(
    (total, topping) => total + topping.price,
    0,
  );

  return pizza + toppings - (item.student ? STUDENT_DISCOUNT : 0);
};
