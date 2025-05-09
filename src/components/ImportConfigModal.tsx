import { useEffect, useState } from 'react';

import { downloadConfig } from '../utils/api';
import { storeDataLocally } from '../utils/storage';

type ImportConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ImportConfigModal = ({ isOpen, onClose }: ImportConfigModalProps) => {
  const [importId, setImportId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setImportId('');
      setMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleImport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (!importId) throw new Error('Enter a Configuration ID to import.');
      const data = await downloadConfig(importId);
      storeDataLocally(data);
      setMessage('Configuration imported successfully. Reload to apply.');
    } catch (err: unknown) { // Change 'any' to 'unknown'
      // Type check for error message
      const errorMessage = err instanceof Error ? err.message : 'Import failed.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-950 text-black dark:text-white rounded-xl p-6 w-11/12 max-w-md relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Import Configuration</h2>
        <p className="text-sm mb-4">
          Paste the Configuration ID you generated on another device. This will overwrite current settings.
        </p>
        <input
          type="text"
          value={importId}
          onChange={(e) => setImportId(e.target.value)}
          placeholder="Configuration ID"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleImport}
          disabled={!importId || loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import Configuration'}
        </button>
        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};
