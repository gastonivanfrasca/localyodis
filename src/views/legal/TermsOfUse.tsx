import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { useI18n } from "../../context/i18n";

export const TermsOfUse = () => {
  const { language, t } = useI18n();
  const lastUpdated = "2025-08-01";

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label={t("legal.terms.title") || "Terms of Use"} />

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-10 mb-16 flex flex-col gap-6 py-6 leading-relaxed text-sm md:text-base">
          <p className="text-xs opacity-70">
            {(t("legal.terms.lastUpdated") || "Last updated") + ": " + lastUpdated}
          </p>

          {language === "es" ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Aceptación de los Términos</h2>
              <p>
                Al usar LocalYodis (la "Aplicación"), aceptas estos Términos de Uso. Si no estás de acuerdo, por favor no utilices la Aplicación.
              </p>

              <h2 className="text-lg font-semibold">Descripción del Servicio</h2>
              <p>
                La Aplicación permite descubrir, gestionar y leer contenido de fuentes RSS/Atom de terceros. No alojamos ni controlamos el contenido de esas fuentes.
              </p>

              <h2 className="text-lg font-semibold">Uso Aceptable</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>No utilices la Aplicación para infringir derechos de autor u otros derechos de terceros.</li>
                <li>No intentes dañar, interferir o acceder sin autorización a nuestros sistemas o a los de terceros.</li>
                <li>Eres responsable del uso que hagas de los enlaces y contenidos de terceros a los que accedes desde la Aplicación.</li>
              </ul>

              <h2 className="text-lg font-semibold">Contenido de Terceros</h2>
              <p>
                El contenido mostrado proviene de sitios y servicios de terceros. No respaldamos ni somos responsables de la exactitud, disponibilidad o legalidad de dicho contenido. Los derechos sobre el contenido pertenecen a sus titulares.
              </p>

              <h2 className="text-lg font-semibold">Propiedad Intelectual</h2>
              <p>
                LocalYodis y sus logotipos son marcas o signos distintivos de sus respectivos titulares. El contenido de las fuentes RSS pertenece a sus autores o propietarios.
              </p>

              <h2 className="text-lg font-semibold">Exención de Garantías</h2>
              <p>
                La Aplicación se ofrece "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas. No garantizamos que el servicio sea ininterrumpido o libre de errores.
              </p>

              <h2 className="text-lg font-semibold">Limitación de Responsabilidad</h2>
              <p>
                En la medida máxima permitida por la ley, no seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso o la imposibilidad de uso de la Aplicación.
              </p>

              <h2 className="text-lg font-semibold">Cambios en los Términos</h2>
              <p>
                Podemos modificar estos Términos en cualquier momento. La fecha de última actualización figurará al inicio y el uso continuado de la Aplicación tras un cambio implica la aceptación de los nuevos términos.
              </p>

              <h2 className="text-lg font-semibold">Legislación Aplicable</h2>
              <p>
                Estos Términos se regirán por las leyes aplicables de tu jurisdicción, sin perjuicio de cualquier conflicto de leyes.
              </p>

              <h2 className="text-lg font-semibold">Contacto</h2>
              <p>
                Para consultas sobre estos Términos, contáctanos en: legal@localyodis.app
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Acceptance of Terms</h2>
              <p>
                By using LocalYodis (the "App"), you agree to these Terms of Use. If you do not agree, please do not use the App.
              </p>

              <h2 className="text-lg font-semibold">Service Description</h2>
              <p>
                The App helps you discover, manage, and read content from third‑party RSS/Atom sources. We do not host or control the content from those sources.
              </p>

              <h2 className="text-lg font-semibold">Acceptable Use</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Do not use the App to infringe copyrights or other rights of third parties.</li>
                <li>Do not attempt to harm, interfere with, or gain unauthorized access to our systems or those of others.</li>
                <li>You are responsible for your use of third‑party links and content accessed through the App.</li>
              </ul>

              <h2 className="text-lg font-semibold">Third‑Party Content</h2>
              <p>
                Content displayed comes from third‑party sites and services. We do not endorse and are not responsible for the accuracy, availability, or legality of such content. Rights over content belong to their respective owners.
              </p>

              <h2 className="text-lg font-semibold">Intellectual Property</h2>
              <p>
                LocalYodis and its logos are trademarks or distinctive signs of their respective holders. Content from RSS sources belongs to its authors or owners.
              </p>

              <h2 className="text-lg font-semibold">Disclaimer of Warranties</h2>
              <p>
                The App is provided "as is" and "as available", without warranties of any kind, express or implied. We do not warrant uninterrupted or error‑free service.
              </p>

              <h2 className="text-lg font-semibold">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of or inability to use the App.
              </p>

              <h2 className="text-lg font-semibold">Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. The last updated date will be shown above, and continued use after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-lg font-semibold">Governing Law</h2>
              <p>
                These Terms will be governed by the applicable laws of your jurisdiction, without regard to conflict‑of‑law principles.
              </p>

              <h2 className="text-lg font-semibold">Contact</h2>
              <p>
                For questions about these Terms, contact us at: legal@localyodis.app
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


