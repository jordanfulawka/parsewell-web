type GenericModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  dialogText: string;
  cancelText: string;
  confirmText: string;
};

function GenericModal({
  onConfirm,
  onCancel,
  dialogText,
  cancelText,
  confirmText,
}: GenericModalProps) {
  return (
    <div
      className='fixed inset-0 z-50 backdrop-blur-md flex justify-center items-center'
      onClick={onCancel}
    >
      <div
        className='bg-[#FDFBF8] p-3 rounded-lg shadow-md'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-sm text-primary-text'>
          <div className='pb-5'>{dialogText}</div>
          <div className='flex justify-around'>
            <button
              className='border border-subtle-border p-3 rounded-xl cursor-pointer hover:bg-[#ECE3D6]'
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className='bg-[#7FA687] p-3 rounded-xl hover:bg-[#6D9476] cursor-pointer text-white'
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenericModal;
