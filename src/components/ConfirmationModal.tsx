type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDestructive?: boolean;
};

export const ConfirmationModal = (props: ConfirmationModalProps) => {
  const { 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    isDestructive = false
  } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600 rounded-2xl p-6 w-11/12 max-w-md relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2.5 px-6 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm tracking-tight"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={`font-medium py-2.5 px-6 rounded-xl transition text-sm tracking-tight ${
              isDestructive 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
            }`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}; 