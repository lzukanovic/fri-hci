import React from 'react';
import { Button, Modal } from 'flowbite-react';
import { MdOutlineError } from 'react-icons/md';

interface OrderItemModalProps {
  show: boolean;
  onClose: (confirm: boolean) => void;
  actionText?: string;
  confirmText?: string;
  confirmColor?: string;
}

const ConfirmModal: React.FC<OrderItemModalProps> = ({
  show,
  onClose,
  actionText,
  confirmText,
  confirmColor,
}) => {
  return (
    <Modal show={show} size="md" onClose={() => onClose(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <MdOutlineError className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {actionText
              ? `Ali želite ${actionText} ta izdelek?`
              : 'Ali želite nadaljevati s to akcijo?'}
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={confirmColor ?? 'blue'}
              onClick={() => onClose(true)}
            >
              {confirmText ?? 'Potrdi'}
            </Button>
            <Button color="gray" onClick={() => onClose(false)}>
              Prekliči
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
