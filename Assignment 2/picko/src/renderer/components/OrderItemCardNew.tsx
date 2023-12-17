import { MdAddBox } from 'react-icons/md';

const OrderItemCardNew = () => {
  // TODO: Use accent color on hover
  return (
    <button className="block w-full rounded-lg border border-dashed border-gray-300 p-6 text-gray-300 hover:bg-gray-100 hover:bg-opacity-50 hover:text-gray-500 dark:border-gray-700 dark:hover:bg-gray-700">
      <MdAddBox className="mx-auto text-4xl" />
    </button>
  );
};

export default OrderItemCardNew;
