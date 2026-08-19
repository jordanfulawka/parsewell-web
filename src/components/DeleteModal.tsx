function DeleteModal({
  onClose,
  onDelete,
}: {
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className='fixed inset-0 z-50 backdrop-blur-md flex justify-center items-center'
      onClick={onClose}
    >
      <div
        className='bg-[#FDFBF8] p-3 rounded-lg shadow-md'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-sm text-primary-text'>
          <div className='pb-5'>
            Are you sure you want to delete this application?
          </div>
          <div className='flex justify-around'>
            <button
              className='border border-subtle-border p-3 rounded-xl cursor-pointer hover:bg-[#ECE3D6]'
              onClick={onClose}
            >
              No, go back!
            </button>
            <button
              className='bg-[#7FA687] p-3 rounded-xl hover:bg-[#6D9476] cursor-pointer text-white'
              onClick={onDelete}
            >
              Yes, delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
