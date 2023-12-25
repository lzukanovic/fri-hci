import { MdAdd } from 'react-icons/md';

interface OrderItemCardNewProps {
  onSelect: () => void;
  invalid: boolean;
}

const OrderItemCardNew: React.FC<OrderItemCardNewProps> = ({
  onSelect,
  invalid = false,
}) => {
  const fieldStyle = () => {
    return invalid
      ? 'block w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 bg-opacity-50 p-6 text-red-300 transition-all hover:border-red-700 hover:bg-red-200 hover:text-red-700 dark:border-red-900 dark:bg-red-700 dark:bg-opacity-10 dark:text-red-900 dark:hover:border-red-500 dark:hover:bg-red-700 dark:hover:bg-opacity-30 dark:hover:text-red-500'
      : 'block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-gray-300 transition-all hover:border-gray-700 hover:bg-gray-100 hover:bg-opacity-50 hover:text-gray-500 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200';
  };

  return (
    <button onClick={onSelect} className={fieldStyle()}>
      <MdAdd className="mx-auto text-4xl" />
    </button>
  );
};

export default OrderItemCardNew;
