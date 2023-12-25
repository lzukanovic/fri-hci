import { round } from 'lodash';
import { Order, PizzaType, Size, StatusType } from '../context/OrderContext';

export const getCreditCardNumberDisplay = (order: Order) => {
  if (!order?.creditCard?.number) return '';
  const lastFourDigits = order.creditCard.number.slice(-4);
  return `**** **** **** ${lastFourDigits}`;
};

export const getPriceDifferenceDisplay = (price: number) => {
  return (price >= 0 ? '+' : '') + round(price, 2);
};

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

export const getPizzaNameDisplay = (type: PizzaType | undefined) => {
  switch (type) {
    case 'margarita':
      return 'Margarita';
    case 'classic':
      return 'Klasična';
    case 'vegetarian':
      return 'Zelenjavna';
    case 'country':
      return 'Kmečka';
    case 'karst':
      return 'Kraška';
    case 'seafood':
      return 'Morska';
    default:
      return 'Margarita';
  }
};

export const getToppingNameDisplay = (
  name: string | undefined,
  customDisplayName: string = '',
) => {
  if (customDisplayName) return customDisplayName;
  switch (name) {
    case 'corn':
      return 'Koruza';
    case 'egg':
      return 'Jajce';
    case 'artichoke':
      return 'Artičoka';
    case 'zucchini':
      return 'Bučka';
    case 'sourCream':
      return 'Kisla smetana';
    case 'onion':
      return 'Čebula';
    case 'prosciutto':
      return 'Pršut';
    case 'pepper':
      return 'Paprika';

    case 'cheese':
      return 'Sir';
    case 'tomato':
      return 'Pelati';
    case 'ham':
      return 'Šunka';
    case 'mushrooms':
      return 'Gobice';
    case 'tuna':
      return 'Tuna';
    default:
      return 'Neznana sestavina';
  }
};

export const getStatusNameDisplay = (status: StatusType | undefined) => {
  switch (status) {
    case 'created':
      return 'Ustvarjeno';
    case 'preparation':
      return 'V pripravi';
    case 'prepared':
      return 'Pripravljeno';
    case 'delivery':
      return 'V dostavi';
    case 'delivered':
      return 'Dostavljeno';
    case 'canceled':
      return 'Preklicano';
    default:
      return 'Neznano';
  }
};
