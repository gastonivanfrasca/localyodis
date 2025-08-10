import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { useI18n } from "../../context/i18n";

export const PrivacyPolicy = () => {
  const { language, t } = useI18n();
  const lastUpdated = "2025-08-01";

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label={t("legal.privacy.title") || "Privacy Policy"} />

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-10 mb-16 flex flex-col gap-6 py-6 leading-relaxed text-sm md:text-base">
          <p className="text-xs opacity-70">
            {(t("legal.privacy.lastUpdated") || "Last updated") + ": " + lastUpdated}
          </p>

          {language === "es" ? (
            <div className="flex flex-col gap-4">
              <p>
                Esta Política de Privacidad describe cómo LocalYodis (la "Aplicación") maneja la información del usuario. Nos
                tomamos la privacidad muy en serio y diseñamos la Aplicación para minimizar la recopilación de datos personales.
              </p>
              <h2 className="text-lg font-semibold">Resumen</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>No recopilamos datos personales identificables.</li>
                <li>No utilizamos servicios de analítica, seguimiento ni publicidad de terceros.</li>
                <li>Los datos de configuración, historial y favoritos se almacenan únicamente en tu dispositivo (localStorage).</li>
                <li>La Aplicación realiza solicitudes a un backend para obtener y descubrir feeds RSS/Atom, sin asociarlas a una identidad personal.</li>
              </ul>

              <h2 className="text-lg font-semibold">Información que procesamos</h2>
              <p>
                La Aplicación permite gestionar fuentes RSS y leer contenidos. Para ofrecer esta funcionalidad, se guardan en tu
                dispositivo las siguientes categorías de datos: fuentes configuradas, elementos leídos, historial de enlaces
                visitados, estado visual (tema) e idioma preferido. Estos datos se guardan localmente en tu dispositivo mediante
                localStorage y puedes eliminarlos restableciendo la configuración desde la sección de Configuración.
              </p>

              <h2 className="text-lg font-semibold">Transferencias y backend</h2>
              <p>
                Para obtener contenido de terceros, la Aplicación consulta un servicio backend que recupera y normaliza feeds RSS o
                ayuda a descubrirlos. Estas solicitudes incluyen las URLs de los sitios/feeds, pero no incluyen información personal
                identificable. No creamos perfiles de usuario ni rastreamos tu actividad entre servicios.
              </p>

              <h2 className="text-lg font-semibold">Permisos y credenciales</h2>
              <p>
                La Aplicación no requiere permisos especiales del sistema (como acceso a contactos, cámara o ubicación). No hay
                inicio de sesión ni cuentas.
              </p>

              <h2 className="text-lg font-semibold">Retención y control</h2>
              <p>
                Dado que la información se almacena localmente en tu dispositivo, tú controlas su conservación. Puedes eliminarla en
                cualquier momento restableciendo la configuración desde la sección de Configuración.
              </p>

              <h2 className="text-lg font-semibold">Menores</h2>
              <p>
                La Aplicación no está dirigida a menores y no recopila conscientemente información personal de niños.
              </p>

              <h2 className="text-lg font-semibold">Cambios en esta política</h2>
              <p>
                Podremos actualizar esta Política de Privacidad para reflejar cambios en la funcionalidad o requisitos legales. La
                fecha de la última actualización se indicará al inicio del documento.
              </p>

              <h2 className="text-lg font-semibold">Contacto</h2>
              <p>
                Si tienes preguntas sobre esta Política, puedes contactarnos en: localyodissupport@gmail.com
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p>
                This Privacy Policy explains how LocalYodis (the "App") handles user information. We take privacy seriously and
                designed the App to minimize personal data collection.
              </p>
              <h2 className="text-lg font-semibold">Summary</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not collect personally identifiable information.</li>
                <li>We do not use third‑party analytics, tracking, or advertising services.</li>
                <li>Configuration, history, and bookmarks are stored only on your device (localStorage).</li>
                <li>The App talks to a backend to fetch and discover RSS/Atom feeds, without associating requests to a personal identity.</li>
              </ul>

              <h2 className="text-lg font-semibold">Information we process</h2>
              <p>
                The App lets you manage RSS sources and read content. To provide this functionality, the following categories are
                stored on your device: configured sources, read items, visited links history, visual state (theme), and preferred
                language. These are saved locally via localStorage and you may delete them anytime by resetting the configuration in
                Settings.
              </p>

              <h2 className="text-lg font-semibold">Transfers and backend</h2>
              <p>
                To retrieve third‑party content, the App queries a backend service that fetches and normalizes RSS feeds or helps
                discover them. These requests include the URLs of sites/feeds but do not include personally identifiable information.
                We do not build user profiles or track your activity across services.
              </p>

              <h2 className="text-lg font-semibold">Permissions and credentials</h2>
              <p>
                The App does not require special system permissions (such as access to contacts, camera, or location). There is no
                sign‑in and no accounts.
              </p>

              <h2 className="text-lg font-semibold">Retention and control</h2>
              <p>
                Because information is stored locally on your device, you control retention. You can delete it at any time by
                resetting the configuration from Settings.
              </p>

              <h2 className="text-lg font-semibold">Children</h2>
              <p>
                The App is not directed to children and does not knowingly collect personal information from children.
              </p>

              <h2 className="text-lg font-semibold">Changes to this policy</h2>
              <p>
                We may update this Policy to reflect changes in functionality or legal requirements. The last updated date will be
                shown at the top of this document.
              </p>

              <h2 className="text-lg font-semibold">Contact</h2>
              <p>
                If you have questions about this Policy, contact us at: localyodissupport@gmail.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


