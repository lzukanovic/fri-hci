import { Pizza, PizzaType } from '../context/OrderContext';

export const DEFAULT_PIZZAS: Pizza[] = [
  {
    name: 'margarita',
    basePrice: 10,
    size: 's',
    defaultToppings: [{ name: 'cheese' }, { name: 'tomato' }],
  },
  {
    name: 'classic',
    basePrice: 11,
    size: 's',
    defaultToppings: [
      { name: 'cheese' },
      { name: 'tomato' },
      { name: 'ham' },
      { name: 'mushrooms' },
    ],
  },
  {
    name: 'vegetarian',
    basePrice: 9,
    size: 's',
    defaultToppings: [
      { name: 'cheese' },
      { name: 'tomato' },
      { name: 'corn' },
      { name: 'egg' },
      { name: 'artichoke' },
      { name: 'zucchini' },
    ],
  },
  {
    name: 'country',
    basePrice: 11,
    size: 's',
    defaultToppings: [
      { name: 'cheese' },
      { name: 'tomato' },
      { name: 'sourCream' },
      { name: 'onion' },
      { name: 'prosciutto' },
    ],
  },
  {
    name: 'karst',
    basePrice: 12,
    size: 's',
    defaultToppings: [
      { name: 'cheese' },
      { name: 'tomato' },
      { name: 'prosciutto' },
      { name: 'pepper' },
    ],
  },
  {
    name: 'seafood',
    basePrice: 14,
    size: 's',
    defaultToppings: [
      { name: 'cheese' },
      { name: 'tomato' },
      { name: 'tuna' },
      { name: 'onion' },
      { name: 'corn' },
    ],
  },
];

type PizzaDictionary = { [key: string]: Pizza };
export const DEFAULT_PIZZA_DICTIONARY: PizzaDictionary =
  DEFAULT_PIZZAS.reduce<PizzaDictionary>(
    (acc, pizza) => ({
      ...acc,
      [pizza.name]: pizza,
    }),
    {},
  );
