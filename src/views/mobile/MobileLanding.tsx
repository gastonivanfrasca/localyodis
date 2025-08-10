import { useNavigate } from "react-router";
import { useI18n } from "../../context/i18n";

const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.localyodis";

export const MobileLanding = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleOpenPlayStore = () => {
    window.location.href = PLAY_STORE_URL;
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.4), transparent 25%), radial-gradient(circle at 90% 20%, rgba(255,255,255,0.25), transparent 30%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2), transparent 30%)'}} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-7 py-10 text-center">
        <img src="/logo.png" alt="LocalYodis" className="w-20 h-20 drop-shadow-lg" />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
          {t('mobile.landing.title')}
        </h1>
        <p className="mt-2 text-emerald-50/90 max-w-md">
          {t('mobile.landing.subtitle')}
        </p>

        {/* Feature highlights */}
        <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-sm">
          <div className="rounded-xl bg-white/10 backdrop-blur px-4 py-3 text-left">
            <div className="text-sm font-semibold">{t('mobile.landing.highlight1.title')}</div>
            <div className="text-emerald-50/90 text-xs">{t('mobile.landing.highlight1.desc')}</div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur px-4 py-3 text-left">
            <div className="text-sm font-semibold">{t('mobile.landing.highlight2.title')}</div>
            <div className="text-emerald-50/90 text-xs">{t('mobile.landing.highlight2.desc')}</div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur px-4 py-3 text-left">
            <div className="text-sm font-semibold">{t('mobile.landing.highlight3.title')}</div>
            <div className="text-emerald-50/90 text-xs">{t('mobile.landing.highlight3.desc')}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 w-full max-w-sm">
          <button
            onClick={handleOpenPlayStore}
            className="w-full py-3 rounded-xl bg-white text-emerald-700 font-semibold shadow-lg shadow-emerald-900/20 active:scale-[0.99]"
          >
            {t('mobile.landing.downloadOpen')}
          </button>

          <div className="mt-5 text-xs text-emerald-50/80">
            {t('mobile.landing.desktopInfo')}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-xs underline underline-offset-4 text-emerald-50/90"
          >
            {t('mobile.landing.openDesktopLink')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLanding;


