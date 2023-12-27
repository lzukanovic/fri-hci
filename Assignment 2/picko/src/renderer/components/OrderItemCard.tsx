import React, { useState } from 'react';
import { OrderItem } from '../context/OrderContext';
import { MdContentCopy, MdEdit, MdDelete } from 'react-icons/md';
import { getOrderItemTotal } from '../utils/order.util';
import {
  getPizzaNameDisplay,
  getPizzaSizeText,
  getToppingNameDisplay,
} from '../utils/display.util';
import ConfirmModal from './ConfirmModal';
import { Tooltip } from 'flowbite-react';

interface OrderItemCardProps {
  item: OrderItem;
  onDuplicate: (item: OrderItem) => void;
  onEdit: (item: OrderItem) => void;
  onDelete: (item: OrderItem) => void;
}

type ModalAction = 'duplicate' | 'delete' | null;

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  onDuplicate,
  onEdit,
  onDelete,
}) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<ModalAction>(null);

  const onDuplicateHandler = () => {
    // Wait for user confirmation from the dialog
    setPendingAction('duplicate');
    setOpenConfirmModal(true);
  };
  const onDeleteHandler = () => {
    // Wait for user confirmation from the dialog
    setPendingAction('delete');
    setOpenConfirmModal(true);
  };

  // Confirm modal
  const onCloseConfirmModal = (confirm: boolean) => {
    if (confirm) {
      if (pendingAction === 'duplicate') {
        onDuplicate(item);
      } else if (pendingAction === 'delete') {
        onDelete(item);
      }
    }
    setOpenConfirmModal(false);
    setPendingAction(null);
  };

  const getModalActionText = () => {
    if (pendingAction === 'duplicate') {
      return 'podvojiti';
    } else if (pendingAction === 'delete') {
      return 'odstraniti';
    }
  };

  const getModalConfirmText = () => {
    if (pendingAction === 'duplicate') {
      return 'Podvoji';
    } else if (pendingAction === 'delete') {
      return 'Odstrani';
    }
  };

  const getModalConfirmColor = () => {
    if (pendingAction === 'duplicate') {
      return 'blue';
    } else if (pendingAction === 'delete') {
      return 'failure';
    }
  };

  return (
    <>
      <div className="relative block w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-3 dark:border-gray-700 dark:bg-gray-800">
        <span className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.quantity}x {getPizzaNameDisplay(item.pizza.name)}
          </h3>
          {/* Header Buttons */}
          <span className="flex items-center space-x-2">
            <Tooltip animation="duration-500" content="Podvoji izdelek">
              <button
                type="button"
                onClick={onDuplicateHandler}
                className="inline-flex items-center rounded-lg bg-white p-3 text-center font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-800"
              >
                <MdContentCopy />
                <span className="sr-only">Podvojite izdelek</span>
              </button>
            </Tooltip>
            <Tooltip animation="duration-500" content="Uredi izdelek">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="inline-flex items-center rounded-lg bg-white p-3 text-center font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-800"
              >
                <MdEdit />
                <span className="sr-only">Uredite izdelek</span>
              </button>
            </Tooltip>
            {/* Placement top on the last button (near the edge) triggers weird resize exception */}
            <Tooltip
              animation="duration-500"
              content="Izbriši izdelek"
              placement="left"
            >
              <button
                type="button"
                onClick={onDeleteHandler}
                className="inline-flex items-center rounded-lg bg-white p-3 text-center font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-800"
              >
                <MdDelete />
                <span className="sr-only">Odstranite izdelek</span>
              </button>
            </Tooltip>
          </span>
        </span>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          Velikost: {getPizzaSizeText(item.pizza.size)}
        </div>
        {!!item.removedToppings?.length && (
          <div className="font-normal text-gray-700 dark:text-gray-400">
            Odstrani:{' '}
            {item.removedToppings
              .map((topping) => getToppingNameDisplay(topping.name))
              .join(', ')}
          </div>
        )}
        <div className="font-normal text-gray-700 dark:text-gray-400">
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
        </div>
        {item.student && (
          <div className="font-normal text-gray-700 dark:text-gray-400">
            Študentski boni: Da
          </div>
        )}
        <div className="flex justify-end text-lg font-semibold text-gray-900 dark:text-white">
          {getOrderItemTotal(item)} €
        </div>
      </div>
      <ConfirmModal
        show={openConfirmModal}
        onClose={onCloseConfirmModal}
        actionText={getModalActionText()}
        confirmText={getModalConfirmText()}
        confirmColor={getModalConfirmColor()}
      />
    </>
  );
};

export default OrderItemCard;
