import { getFaqItems } from "@/lib/site";

export default function Faq() {
  const items = getFaqItems();

  return (
    <section id="dotazy" className="py-24 md:py-32 bg-white relative border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-600 font-sans mb-3 font-semibold">
            Dotazy
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight leading-tight">
            Časté dotazy k úklidu
          </h2>
          <p className="mt-6 text-sm md:text-base text-slate-700 font-normal leading-relaxed max-w-2xl">
            Odpovědi vycházejí jen z údajů na této stránce: služby Josefa Pufra, výjezd z Chýnova a orientační sazby kalkulačky.
          </p>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-6" />
        </div>

        <dl className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.question}
              className="p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-sm"
            >
              <dt>
                <h3 className="font-serif text-xl text-slate-900 font-medium leading-snug">
                  {item.question}
                </h3>
              </dt>
              <dd className="mt-3 text-sm text-slate-700 font-normal leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
