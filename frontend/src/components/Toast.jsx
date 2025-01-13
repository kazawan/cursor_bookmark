export default function Toast({ message, type = 'success', onClose }) {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 