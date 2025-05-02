import { useEffect, useState } from 'react';

import QRCode from 'qrcode';
import { getApiUrl } from '../utils/api';
import { getLocallyStoredData } from '../utils/storage';

type ExportConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ExportConfigModal = ({ isOpen, onClose }: ExportConfigModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setQrCodeUrl(null);
      setMessage(null);
      setLoading(false);
      setConfigId(null);
    }
  }, [isOpen]);

  const handleExportConfig = async () => {
    setLoading(true);
    setMessage(null);
    setQrCodeUrl(null);
    setConfigId(null);
    try {
      const localData = getLocallyStoredData();
      const response = await fetch(getApiUrl('/config/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData)
      });
      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
      const { id } = await response.json();
      if (typeof id !== 'string') throw new Error('Invalid server response');

      setConfigId(id);
      const qrData = await QRCode.toDataURL(id, { errorCorrectionLevel: 'L' });
      setQrCodeUrl(qrData);

      try {
        await navigator.clipboard.writeText(id);
        setMessage(`Config ID copied to clipboard. Scan QR code to retrieve it.`);
      } catch {
        setMessage(`QR code generated. Please copy ID manually if needed.`);
      }
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : 'Failed to export configuration';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="bg-white dark:bg-slate-950 text-black dark:text-white rounded-2xl p-6 w-11/12 max-w-md relative shadow-xl transition-colors z-10"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          className="absolute top-4 right-4 text-inherit hover:opacity-80 cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          {/* Simple X icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4">Export Configuration</h2>

        <p className="text-sm mb-4">
          Click the button to upload your configuration and generate a QR code containing a unique ID. Scan this code or copy the ID to import on another device.
        </p>

        <button
          onClick={handleExportConfig}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-4"
        >
          {loading ? 'Exporting...' : 'Generate Export ID & QR Code'}
        </button>

        {message && <p className="mt-2 text-sm text-center">{message}</p>}

        {qrCodeUrl && (
          <div className="mt-4 flex flex-col items-center bg-white p-2 rounded">
            <img src={qrCodeUrl} alt="Configuration QR Code" className="max-w-[200px] w-full" />
            {configId && <p className="text-xs text-gray-600 mt-1 break-all">ID: {configId}</p>}
          </div>
        )}
      </div>
    </div>
  );
};