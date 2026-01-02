import React from 'react';
import CustomButton from '@/components/Custom/CustomButton';

interface DeleteConfirmationModalProps {
  username: string;
  listType: 'followers' | 'followings';
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  username,
  listType,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onDeleteCancel}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl p-6 z-50 border-2 border-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-right" dir="rtl">
          <p className="font-bold text-lg mb-6 text-foreground text-center">
            آیا مطمئن هستید که می‌خواهید{' '}
            <span className="text-primary mx-2" dir="ltr">{username}</span> را از لیست{' '}
            {listType === 'followers' ? 'دنبال‌کنندگان' : 'دنبال‌شوندگان'} حذف کنید؟
          </p>

          <div className="flex flex-col w-full gap-4">
            <CustomButton
              className="bg-primary text-foreground w-full text-xl font-normal px-4 py-3 rounded-xl shadow-foreground border-foreground hover:bg-destructive/90"
              onClick={onDeleteConfirm}
            >
              حذف
            </CustomButton>

            <CustomButton
              className="bg-secondary text-foreground w-full text-xl font-normal px-4 py-3 rounded-xl border-foreground hover:bg-muted/80"
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