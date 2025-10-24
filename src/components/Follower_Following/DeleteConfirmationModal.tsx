import React from 'react';
import CustomButton from '@/components/Custom/CustomButton';

interface DeleteConfirmationModalProps {
  username: string;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ username, onDeleteConfirm, onDeleteCancel }) => {
  return (
    <>
      {/* Overlay with onClick to trigger cancel */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-50 pointer-events-auto"
        onClick={onDeleteCancel} // Cancel on overlay click
      ></div>

      {/* Confirmation Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg p-4 z-60 border-2 border-black"
        onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicked
      >
        <div className="flex flex-col items-center">
          <p className="font-bold text-lg mb-4">آیا مطمئن هستید که می‌خواهید {username} را حذف کنید؟</p>

          <div className="flex flex-col space-x-4">
            <CustomButton
              className="bg-white-500 text-primary px-4 py-2 mb-3 rounded-lg shadow-primary border-primary hover:bg-white"
              onClick={onDeleteConfirm}
            >
              حذف
            </CustomButton>
            <CustomButton
              className="bg-white text-secondary px-4 py-2 rounded-lg shadow-secondary border-secondary hover:bg-white"
              onClick={onDeleteCancel}
            >
              انصراف
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
