import { FileText, Globe, Mail, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";
import { useI18n } from "../../context/i18n";

interface WelcomeProps {
  onContinue: () => void;
}

export const Welcome = ({ onContinue }: WelcomeProps) => {
  const { t, language, setLanguage, languages } = useI18n();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  // Close language selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        setShowLanguageSelector(false);
      }
    };

    if (showLanguageSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageSelector]);

  return (
    <div className="w-full h-dvh dark:bg-slate-950 bg-white flex flex-col">
      {/* Language selector */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div></div> {/* Spacer */}
          <div className="relative" ref={languageSelectorRef}>
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{languages.find(l => l.code === language)?.nativeName}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg min-w-32 z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      language === lang.code 
                        ? 'bg-zinc-100 dark:bg-slate-700 text-zinc-900 dark:text-white font-medium' 
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header with logo/title */}
      <div className="flex-shrink-0 px-6 py-6 text-center">
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

          {/* Additional info section - more compact */}
          <div className="mb-6">
            <details className="group">
              <summary className="cursor-pointer text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 mb-2 flex items-center gap-2">
                <span>{t('welcome.developer') || 'Información del desarrollador'}</span>
                <span className="transform group-open:rotate-90 transition-transform">›</span>
              </summary>
              <div className="text-xs text-zinc-500 dark:text-zinc-500 space-y-1 ml-4 mb-4">
                <p>{t('welcome.permissions') || 'No requiere permisos especiales del sistema'}</p>
                <a 
                  href="mailto:localyodissupport@gmail.com"
                  className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  localyodissupport@gmail.com
                </a>
              </div>
            </details>
          </div>

          {/* Legal links - more compact */}
          <div className="mb-6">
            <div className="flex gap-4 justify-center text-xs">
              <Link 
                to="/privacy-policy"
                className="flex items-center text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <Shield className="w-3 h-3 mr-1" />
                {t('legal.privacy.title') || 'Privacidad'}
              </Link>
              
              <Link 
                to="/terms-of-use"
                className="flex items-center text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <FileText className="w-3 h-3 mr-1" />
                {t('legal.terms.title') || 'Términos'}
              </Link>
            </div>
          </div>

          {/* App version */}
          <div className="mb-6 text-center">
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
