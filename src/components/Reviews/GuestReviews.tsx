import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GOOGLE_REVIEWS_URL, reviewSummary, reviews } from '@/data/reviews';

const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  el: 'el-GR',
  it: 'it-IT',
  de: 'de-DE',
  ro: 'ro-RO',
};

const Stars = ({ className = '', label }: { className?: string; label?: string }) => (
  <div
    className={`flex gap-0.5 ${className}`}
    {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
  >
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="h-4 w-4 fill-wood text-wood" />
    ))}
  </div>
);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Rating summary and review cards for the dark reviews band on the home page.
 * Scrolls sideways on phones, becomes a grid from md up.
 */
const GuestReviews = () => {
  const { t, language } = useLanguage();
  const monthYear = new Intl.DateTimeFormat(DATE_LOCALES[language] ?? 'en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="flex justify-center mb-10">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-2.5 hover:border-wood/40 transition-colors"
        >
          <span className="font-heading text-2xl leading-none text-white">
            {reviewSummary.rating.toFixed(1)}
          </span>
          <Stars />
          <span className="text-sm font-sans text-sand-light/70">
            {reviewSummary.count} {t('home.reviews.googleReviews')}
          </span>
        </a>
      </div>

      <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 scroll-px-5 pb-4 sm:-mx-10 sm:px-10 sm:scroll-px-10 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:mx-0 md:px-0 md:pb-0 lg:grid-cols-3">
        {reviews.map((review) => (
          <li key={review.url} className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto">
            <figure className="h-full flex flex-col rounded-2xl bg-white/5 border border-white/10 p-6">
              <Stars className="mb-4" label={`${review.rating}/5`} />
              <blockquote className="flex-1 text-sand-light/85 text-[15px] leading-relaxed font-sans font-light">
                <p>{review.text}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-9 h-9 shrink-0 rounded-full bg-wood/15 text-wood text-xs font-sans font-semibold flex items-center justify-center"
                >
                  {initials(review.author)}
                </span>
                <span className="font-sans">
                  <span className="block text-sm font-medium text-white">{review.author}</span>
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sand-light/50 hover:text-wood transition-colors"
                  >
                    {monthYear.format(new Date(`${review.date}-01T00:00:00`))} · Google
                  </a>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-wood border-b border-wood/30 pb-0.5 hover:border-wood transition-colors"
        >
          {t('home.reviews.readAll')}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
};

export default GuestReviews;
