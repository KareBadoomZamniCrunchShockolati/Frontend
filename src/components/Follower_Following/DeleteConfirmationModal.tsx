import React from 'react';
import CustomButton from '@/components/Custom/CustomButton';

interface DeleteConfirmationModalProps {
  username: string;
  listType: 'followers' | 'followings'; // Add the listType prop
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ username, listType, onDeleteConfirm, onDeleteCancel }) => {
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
        <div className="flex flex-col items-center text-right">
        <p className="font-bold text-lg mb-4">
             را از لیست  {listType === 'followers' ? 'دنبال‌کنندگان' : 'دنبال‌شوندگان'} حذف کنید؟ 
             <span className="text-primary mr-2 ml-2">{username}</span>
             آیا مطمئن هستید که می‌خواهید 
        </p>




          <div className="flex flex-col space-x-4">
            <CustomButton
              className="bg-white-500 text-primary w-50 text-xl font-normal px-4 py-2 mb-3 rounded-lg shadow-primary border-primary hover:bg-white"
              onClick={onDeleteConfirm}
            >
              حذف
            </CustomButton>
            <CustomButton
              className="bg-white text-secondary w-50 text-xl font-normal px-4 py-2 rounded-lg shadow-secondary border-secondary hover:bg-white"
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
