import { downloadConfig, uploadConfig } from '../../utils/api';
import { getLocallyStoredData, storeDataLocally } from '../../utils/storage';

import { NavBar } from '../../components/BottomNavBar';
import { NavigationWithBack } from '../../components/v2/NavigationItems';
import QRCode from 'qrcode';
import { useNavigation } from '../../context/hooks';
import { useState } from 'react';

export const ExportData = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importId, setImportId] = useState(''); // State for config ID input
  const [importing, setImporting] = useState(false); // State for import loading
  const { isDesktop } = useNavigation();

  const handleExportConfig = async () => {
    setLoading(true);
    setMessage(null);
    setQrCodeUrl(null);
    try {
      const localData = getLocallyStoredData();
      const { id } = await uploadConfig(localData);

      if (typeof id !== 'string') throw new Error('Invalid server response');

      const qrData = await QRCode.toDataURL(id, { errorCorrectionLevel: 'L' });
      setQrCodeUrl(qrData);

      try {
        await navigator.clipboard.writeText(id);
        setMessage(`Config ID copied to clipboard. Scan QR code to retrieve it: ${id}`);
      } catch {
        setMessage(`QR code generated. Please copy ID manually: ${id}`);
      }
    } catch (err: unknown) { // Change 'any' to 'unknown'
      // Type check for error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to export configuration';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImportConfig = async () => {
    setImporting(true);
    setMessage(null);
    try {
      if (!importId) throw new Error('Please enter a Configuration ID to import.');
      const downloadedData = await downloadConfig(importId);
      // Store to localStorage
      storeDataLocally(downloadedData);
      setMessage('Configuration imported successfully! Please reload the app to apply.');
    } catch (err: unknown) { // Change 'any' to 'unknown'
      // Type check for error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to import configuration';
      setMessage(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="w-full h-screen dark:bg-slate-900 md:flex md:flex-row gap-8">
      <NavBar items={<NavigationWithBack />} desktop={isDesktop} />
      <div className="flex flex-col gap-6 p-6 w-full text-black dark:text-white">
        <h2 className="text-2xl font-bold">Export Configuration</h2>
        <button
          onClick={handleExportConfig}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Exporting...' : 'Export Configuration'}
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
        {qrCodeUrl && (
          <div className="mt-4">
            <img src={qrCodeUrl} alt="Configuration QR Code" className="max-w-xs" />
          </div>
        )}

        {/* Import Section */}
        <div className="mt-8 flex flex-col gap-4 w-full max-w-md border dark:border-slate-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Import Configuration</h3>
          <p className="text-sm mb-2">
            Enter the Configuration ID you copied or scanned from your other device.
            <strong className="block mt-1 dark:text-red-400 text-red-600">This will overwrite your current data.</strong>
          </p>
          <input
            type="text"
            value={importId}
            onChange={(e) => setImportId(e.target.value)}
            placeholder="Configuration ID"
            className="w-full p-2 border border-zinc-500 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white mb-4"
          />
          <button
            onClick={handleImportConfig}
            disabled={!importId || importing}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};
