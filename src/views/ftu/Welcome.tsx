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
      <div className="flex-shrink-0 px-6 lg:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-md lg:max-w-6xl mx-auto flex justify-between items-center">
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

      {/* Main content - responsive layout */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md lg:max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            
            {/* Left column - Logo and title (desktop) / Top section (mobile) */}
            <div className="lg:col-span-5 text-center lg:text-left mb-12 lg:mb-0 lg:sticky lg:top-8">
              <div className="mb-8">
                <img 
                  src="/logo.png" 
                  alt="LocalYodis"
                  className="w-24 h-24 lg:w-32 lg:h-32 mx-auto lg:mx-0 mb-6 rounded-xl"
                />
                <h1 className="text-3xl lg:text-5xl font-bold text-zinc-800 dark:text-white tracking-tight mb-4">
                  LocalYodis
                </h1>
                <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto lg:mx-0">
                  {t('welcome.subtitle') || 'Tu lector de noticias RSS local'}
                </p>
              </div>
              
              {/* Desktop CTA - visible only on large screens */}
              <div className="hidden lg:block">
                <button
                  onClick={onContinue}
                  className="w-full lg:w-auto bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-4 px-8 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors text-lg"
                >
                  {t('welcome.getStarted') || 'Comenzar a usar LocalYodis'}
                </button>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-4 max-w-sm">
                  {t('welcome.agreementText') || 'Al continuar, aceptas nuestros términos de uso y política de privacidad'}
                </p>
              </div>
            </div>

            {/* Right column - Content */}
            <div className="lg:col-span-7">
              {/* App description */}
              <div className="mb-10">
                <h2 className="text-xl lg:text-2xl font-semibold text-zinc-800 dark:text-white mb-6">
                  {t('welcome.whatIsThis') || '¿Qué es LocalYodis?'}
                </h2>
                <div className="space-y-4 text-zinc-600 dark:text-zinc-400 lg:text-lg">
                  <p className="leading-relaxed">
                    {t('welcome.description1') || 'LocalYodis es un lector de noticias RSS que te permite seguir tus sitios web favoritos en un solo lugar.'}
                  </p>
                  <p className="leading-relaxed">
                    {t('welcome.description2') || 'Mantén tu privacidad: todos tus datos se almacenan localmente en tu dispositivo.'}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-10">
                <h3 className="text-lg lg:text-xl font-semibold text-zinc-800 dark:text-white mb-6">
                  {t('welcome.features') || 'Características principales'}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex items-start lg:p-4 lg:bg-zinc-50 lg:dark:bg-slate-900 lg:rounded-lg">
                    <span className="text-zinc-400 mr-3 mt-1 text-lg">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400 lg:text-base">
                      {t('welcome.feature1') || 'Agregación de fuentes RSS de todo el mundo'}
                    </span>
                  </div>
                  <div className="flex items-start lg:p-4 lg:bg-zinc-50 lg:dark:bg-slate-900 lg:rounded-lg">
                    <span className="text-zinc-400 mr-3 mt-1 text-lg">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400 lg:text-base">
                      {t('welcome.feature2') || 'Interfaz limpia y fácil de usar'}
                    </span>
                  </div>
                  <div className="flex items-start lg:p-4 lg:bg-zinc-50 lg:dark:bg-slate-900 lg:rounded-lg">
                    <span className="text-zinc-400 mr-3 mt-1 text-lg">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400 lg:text-base">
                      {t('welcome.feature3') || 'Almacenamiento local - tu privacidad protegida'}
                    </span>
                  </div>
                  <div className="flex items-start lg:p-4 lg:bg-zinc-50 lg:dark:bg-slate-900 lg:rounded-lg">
                    <span className="text-zinc-400 mr-3 mt-1 text-lg">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400 lg:text-base">
                      {t('welcome.feature4') || 'Funciona sin conexión una vez cargado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional info section */}
              <div className="mb-8">
                <details className="group">
                  <summary className="cursor-pointer text-sm lg:text-base text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 mb-3 flex items-center gap-2">
                    <span>{t('welcome.developer') || 'Información del desarrollador'}</span>
                    <span className="transform group-open:rotate-90 transition-transform">›</span>
                  </summary>
                  <div className="text-sm lg:text-base text-zinc-500 dark:text-zinc-500 space-y-2 ml-4 mb-4">
                    <p>{t('welcome.permissions') || 'No requiere permisos especiales del sistema'}</p>
                    <a 
                      href="mailto:localyodissupport@gmail.com"
                      className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      localyodissupport@gmail.com
                    </a>
                  </div>
                </details>
              </div>

              {/* Legal links and version */}
              <div className="space-y-4">
                <div className="flex gap-6 justify-center lg:justify-start text-sm">
                  <Link 
                    to="/privacy-policy"
                    className="flex items-center text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {t('legal.privacy.title') || 'Privacidad'}
                  </Link>
                  
                  <Link 
                    to="/terms-of-use"
                    className="flex items-center text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('legal.terms.title') || 'Términos'}
                  </Link>
                </div>

                <div className="text-center lg:text-left">
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">
                    {t('welcome.version') || 'Versión'} 1.0.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only footer with continue button */}
      <div className="lg:hidden flex-shrink-0 px-6 py-6 border-t border-zinc-200 dark:border-zinc-800">
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
