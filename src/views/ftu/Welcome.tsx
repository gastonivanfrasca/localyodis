import { Shield, FileText, Mail, ExternalLink } from "lucide-react";
import { useI18n } from "../../context/i18n";
import { Link } from "react-router";

interface WelcomeProps {
  onContinue: () => void;
}

export const Welcome = ({ onContinue }: WelcomeProps) => {
  const { t } = useI18n();

  return (
    <div className="w-full h-dvh dark:bg-slate-950 bg-white flex flex-col">
      {/* Header with logo/title */}
      <div className="flex-shrink-0 px-6 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <img 
              src="/logo.png" 
              alt="LocalYodis"
              className="w-24 h-24 mx-auto mb-4 rounded-xl"
            />
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white tracking-tight mb-2">
              LocalYodis
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t('welcome.subtitle') || 'Tu lector de noticias RSS local'}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-4">
          {/* App description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">
              {t('welcome.whatIsThis') || '¿Qué es LocalYodis?'}
            </h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <p className="leading-relaxed">
                {t('welcome.description1') || 'LocalYodis es un lector de noticias RSS que te permite seguir tus sitios web favoritos en un solo lugar.'}
              </p>
              <p className="leading-relaxed">
                {t('welcome.description2') || 'Mantén tu privacidad: todos tus datos se almacenan localmente en tu dispositivo.'}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
              {t('welcome.features') || 'Características principales'}
            </h3>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">•</span>
                <span>{t('welcome.feature1') || 'Agregación de fuentes RSS de todo el mundo'}</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">•</span>
                <span>{t('welcome.feature2') || 'Interfaz limpia y fácil de usar'}</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">•</span>
                <span>{t('welcome.feature3') || 'Almacenamiento local - tu privacidad protegida'}</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-2">•</span>
                <span>{t('welcome.feature4') || 'Funciona sin conexión una vez cargado'}</span>
              </li>
            </ul>
          </div>

          {/* Developer info */}
          <div className="mb-8 p-4 bg-zinc-100 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-white mb-2">
              {t('welcome.developer') || 'Información del desarrollador'}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              {t('welcome.developerInfo') || 'Desarrollado con ❤️ para la comunidad de código abierto.'}
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:support@localyodis.app"
                className="inline-flex items-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <Mail className="w-4 h-4 mr-1" />
                support@localyodis.app
              </a>
              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                <p className="mb-1">{t('welcome.openSource') || 'Proyecto de código abierto'}</p>
                <p>{t('welcome.permissions') || 'No requiere permisos especiales del sistema'}</p>
              </div>
            </div>
          </div>

          {/* Legal links */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">
              {t('welcome.legal') || 'Información legal'}
            </h3>
            <div className="space-y-3">
              <Link 
                to="/privacy-policy"
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-slate-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-zinc-500 mr-3" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {t('legal.privacy.title') || 'Política de privacidad'}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </Link>
              
              <Link 
                to="/terms-of-use"
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-slate-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-zinc-500 mr-3" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {t('legal.terms.title') || 'Términos de uso'}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* App version */}
          <div className="mb-8 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              {t('welcome.version') || 'Versión'} 1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Footer with continue button */}
      <div className="flex-shrink-0 px-6 py-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto">
          <button
            onClick={onContinue}
            className="w-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-3 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            {t('welcome.getStarted') || 'Comenzar a usar LocalYodis'}
          </button>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-3">
            {t('welcome.agreementText') || 'Al continuar, aceptas nuestros términos de uso y política de privacidad'}
          </p>
        </div>
      </div>
    </div>
  );
};
