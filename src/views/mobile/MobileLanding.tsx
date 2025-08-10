import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useI18n } from "../../context/i18n";

const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.localyodis";

export const MobileLanding = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    // Mark that user has seen/visited mobile landing to avoid loops when choosing desktop
  }, []);

  const handleOpenPlayStore = () => {
    window.location.href = PLAY_STORE_URL;
  };

  const handleOpenOnDesktop = () => {
    localStorage.setItem('skipMobileLanding', '1');
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
        <img src="/logo.png" alt="LocalYodis" className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">{t('mobile.landing.title')}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t('mobile.landing.subtitle')}</p>

        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={handleOpenPlayStore}
            className="w-full py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 active:bg-green-800"
          >
            {t('mobile.landing.downloadOpen')}
          </button>

          <button
            onClick={handleOpenOnDesktop}
            className="w-full py-3 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700"
          >
            {t('mobile.landing.openDesktop')}
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-zinc-500 hover:underline mt-2"
        >
          {t('common.back')}
        </button>
      </div>
    </div>
  );
};

export default MobileLanding;


