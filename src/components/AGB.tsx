import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Scale from 'lucide-react/dist/esm/icons/scale';
import { Language } from '../types';

interface AGBProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export default function AGB({ lang, isOpen, onClose }: AGBProps) {
  if (!isOpen) return null;

  const isEn = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 bg-canvas dark:bg-primary-deep overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-ink dark:text-canvas hover:text-accent transition-colors mb-6 cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">{isEn ? 'Back' : 'Zurück'}</span>
        </button>

        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-accent uppercase block mb-2">BGB // AGB</span>
            <h1 className="text-3xl font-handwritten font-bold text-ink dark:text-canvas normal-case">
              {isEn ? 'Terms and Conditions' : 'Allgemeine Geschäftsbedingungen'}
            </h1>
            <p className="text-xs text-ink/50 dark:text-canvas/50 mt-2 font-mono">
              {isEn ? 'Last updated: June 2026' : 'Stand: Juni 2026'}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §1 {isEn ? 'Scope' : 'Geltungsbereich'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'These General Terms and Conditions (AGB) apply to all orders placed via the Atzengold online shop at atzengold.vercel.app. The supplier is Atzengold GbR, Atzenhofer Str. 76, 90768 Fürth (Atzenhof).'
              ) : (
                'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die über den Atzengold Online-Shop unter atzengold.vercel.app getätigt werden. Vertragspartner ist die Atzengold GbR, Atzenhofer Str. 76, 90768 Fürth (Atzenhof).'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §2 {isEn ? 'Contract Formation' : 'Vertragsschluss'}
            </h2>
            <div className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed space-y-3">
              <p>
                {isEn ? (
                  'By placing an item in the shopping cart and going through the checkout process, you submit a binding offer to purchase the goods. We confirm receipt of your order by redirecting you to the payment provider (Stripe). The contract is concluded when the payment is successfully processed.'
                ) : (
                  'Mit dem Einstellen der ausgewählten Artikel in den Warenkorb und dem Durchlaufen des Bestellvorgangs geben Sie ein verbindliches Angebot zum Kauf der Waren ab. Wir bestätigen den Eingang Ihrer Bestellung durch Weiterleitung an den Zahlungsdienstleister (Stripe). Der Vertrag kommt mit erfolgreicher Zahlungsabwicklung zustande.'
                )}
              </p>
              <p>
                {isEn ? (
                  'The presentation of products in the online shop does not constitute a legally binding offer, but an invitation to place an order.'
                ) : (
                  'Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Bestellung.'
                )}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §3 {isEn ? 'Prices and Payment' : 'Preise und Zahlung'}
            </h2>
            <div className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed space-y-3">
              <p>
                {isEn ? (
                  'All prices are in Euro (€) and include the statutory value-added tax (VAT) as well as shipping within Germany.'
                ) : (
                  'Alle Preise verstehen sich in Euro (€) und enthalten die gesetzliche Umsatzsteuer (MwSt.) sowie den Versand innerhalb Deutschlands.'
                )}
              </p>
              <p>
                {isEn ? (
                  'Payment is made via Stripe (credit card, SEPA direct debit, or other payment methods offered by Stripe).'
                ) : (
                  'Die Zahlung erfolgt über Stripe (Kreditkarte, SEPA-Lastschrift oder weitere von Stripe angebotene Zahlungsmethoden).'
                )}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §4 {isEn ? 'Shipping and Delivery' : 'Lieferung und Versand'}
            </h2>
            <div className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed space-y-3">
              <p>
                {isEn ? (
                  'Delivery is made via DHL GoGreen (climate-neutral) to addresses within Germany only. Shipping costs are already included in the item price — no additional shipping fee is charged. Delivery time is approximately 2-4 business days.'
                ) : (
                  'Die Lieferung erfolgt ausschließlich innerhalb Deutschlands per DHL GoGreen (klimaneutral). Die Versandkosten sind bereits im Artikelpreis enthalten — es fallen keine zusätzlichen Versandkosten an. Die Lieferzeit beträgt ca. 2-4 Werktage.'
                )}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §5 {isEn ? 'Right of Withdrawal' : 'Widerrufsrecht'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'Consumers have a fourteen-day right of withdrawal. Details can be found in our separate Withdrawal Policy (Widerrufsbelehrung).'
              ) : (
                'Verbrauchern steht ein vierzehntägiges Widerrufsrecht zu. Einzelheiten finden Sie in unserer separaten Widerrufsbelehrung.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §6 {isEn ? 'Retention of Title' : 'Eigentumsvorbehalt'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'The goods remain our property until full payment has been made.'
              ) : (
                'Die Ware bleibt bis zur vollständigen Zahlung unser Eigentum.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §7 {isEn ? 'Liability' : 'Haftung'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'We are liable for damages caused by intent or gross negligence. In the case of slight negligence, we are only liable in the event of a breach of essential contractual obligations, limited to the foreseeable damage typical for the contract.'
              ) : (
                'Wir haften für Schäden, die durch Vorsatz oder grobe Fahrlässigkeit verursacht werden. Bei einfacher Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten, beschränkt auf den vertragstypischen, vorhersehbaren Schaden.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent shrink-0" />
              §8 {isEn ? 'Dispute Resolution' : 'Streitbeilegung'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'The European Commission provides an online dispute resolution platform at ec.europa.eu/consumers/odr/. We are not obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.'
              ) : (
                'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung unter ec.europa.eu/consumers/odr/ bereit. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
