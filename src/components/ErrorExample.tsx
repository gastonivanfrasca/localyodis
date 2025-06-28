import React from 'react';
import { useError } from '../utils/useError';

const ErrorExample: React.FC = () => {
  const { showError } = useError();

  const handleErrorExample = () => {
    showError('Esto es un mensaje de error de ejemplo', 'error');
  };

  const handleWarningExample = () => {
    showError('Esto es una advertencia de ejemplo', 'warning');
  };

  const handleSuccessExample = () => {
    showError('Operación completada exitosamente', 'success');
  };

  const handleInfoExample = () => {
    showError('Esta es información adicional', 'info');
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <h3 className="text-lg font-semibold mb-2">Prueba de Notificaciones</h3>
      <button
        onClick={handleErrorExample}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Mostrar Error
      </button>
      <button
        onClick={handleWarningExample}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Mostrar Advertencia
      </button>
      <button
        onClick={handleSuccessExample}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Mostrar Éxito
      </button>
      <button
        onClick={handleInfoExample}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Mostrar Info
      </button>
    </div>
  );
};

export default ErrorExample; 