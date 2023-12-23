import { MdAdd } from 'react-icons/md';

interface OrderItemCardNewProps {
  onSelect: () => void;
}

const OrderItemCardNew: React.FC<OrderItemCardNewProps> = ({ onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-300 transition-all hover:bg-gray-100 hover:bg-opacity-50 hover:text-gray-500 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
    >
      <MdAdd className="mx-auto text-4xl" />
    </button>
  );
};

export default OrderItemCardNew;
