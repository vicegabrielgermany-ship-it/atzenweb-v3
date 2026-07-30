import X from 'lucide-react/dist/esm/icons/x';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { Language } from '../types';

interface WiderrufsrechtProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export default function Widerrufsrecht({ lang, isOpen, onClose }: WiderrufsrechtProps) {
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
            <span className="text-[10px] font-mono font-bold tracking-wider text-accent uppercase block mb-2">BGB // § 355</span>
            <h1 className="text-3xl font-handwritten font-bold text-ink dark:text-canvas normal-case">
              {isEn ? 'Right of Withdrawal' : 'Widerrufsbelehrung'}
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'Right of Withdrawal for Consumers' : 'Widerrufsrecht für Verbraucher'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'As a consumer, you have the right to withdraw from this contract within fourteen days without giving any reason.'
              ) : (
                'Verbrauchern steht ein vierzehntägiges Widerrufsrecht zu. Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'Withdrawal Period' : 'Widerrufsfrist'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'The withdrawal period is fourteen days from the day on which you or a third party designated by you, who is not the carrier, took possession of the last goods.'
              ) : (
                'Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'How to Exercise Your Right' : 'Ausübung des Widerrufsrechts'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'To exercise your right of withdrawal, you must inform us of your decision to withdraw from this contract by means of a clear statement.'
              ) : (
                'Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'Address for Withdrawal' : 'Widerrufsadresse'}
            </h2>
            <div className="bg-ink/5 dark:bg-canvas/5 rounded-xl p-4 border border-ink/10 dark:border-canvas/10 text-sm text-ink/80 dark:text-canvas/80 space-y-1 font-mono">
              <p className="font-bold text-ink dark:text-canvas">Atzengold GbR</p>
              <p>Gabriel Platt</p>
              <p>Atzenhofer Str. 76</p>
              <p>90768 Fürth (Atzenhof)</p>
              <p>E-Mail: info@atzengold.net</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'Consequences of Withdrawal' : 'Widerrufsfolgen'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'If you withdraw from this contract, we will reimburse all payments received from you, including the cost of delivery (except for supplementary costs resulting from your choice of a type of delivery other than the least expensive type of standard delivery), without undue delay and in any event not later than fourteen days from the day on which we are informed about your decision to withdraw from this contract.'
              ) : (
                'Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die daraus entstehen, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.'
              )}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'Sample Withdrawal Form' : 'Muster-Widerrufsformular'}
            </h2>
            <div className="bg-ink/5 dark:bg-canvas/5 rounded-xl p-4 border border-ink/10 dark:border-canvas/10 text-sm text-ink/80 dark:text-canvas/80 leading-relaxed font-mono">
              <p className="mb-4">{isEn ? 'If you wish to withdraw, please fill out this form and send it to us:' : 'Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück:'}</p>
              <p className="mb-2">— {isEn ? 'To Atzengold GbR, Atzenhofer Str. 76, 90768 Fürth (Atzenhof), info@atzengold.net' : 'An Atzengold GbR, Atzenhofer Str. 76, 90768 Fürth (Atzenhof), info@atzengold.net'}</p>
              <p className="mb-2">{isEn ? 'I/We hereby give notice that I/we withdraw from my/our contract of sale of the following goods:' : 'Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren:'}</p>
              <p className="mb-2">{isEn ? 'Ordered on / Received on:' : 'Bestellt am / Erhalten am:'} _______________</p>
              <p className="mb-2">{isEn ? 'Name of consumer(s):' : 'Name des/der Verbraucher(s):'} _______________</p>
              <p className="mb-2">{isEn ? 'Address:' : 'Anschrift:'} _______________</p>
              <p className="mb-2">{isEn ? 'Signature of consumer(s):' : 'Unterschrift des/der Verbraucher(s):'} _______________</p>
              <p>{isEn ? 'Date:' : 'Datum:'} _______________</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-ink dark:text-canvas uppercase tracking-tight">
              {isEn ? 'Exclusion of the Right of Withdrawal' : 'Ausschluss des Widerrufsrechts'}
            </h2>
            <p className="text-sm text-ink/80 dark:text-canvas/80 leading-relaxed">
              {isEn ? (
                'The right of withdrawal does not apply to contracts for the supply of goods that are not prefabricated and are manufactured on the basis of an individual selection or determination by the consumer, or for the supply of sealed goods which are not suitable for return due to health protection or hygiene reasons if their seal has been removed after delivery.'
              ) : (
                'Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist, sowie bei der Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde.'
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
