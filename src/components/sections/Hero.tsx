import { Button } from '@/components/ui/Button';
import { heroContent } from '@/content/home';
import styles from './Hero.module.scss';

interface HeroProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
}

export function Hero({
  title = heroContent.title,
  subtitle = heroContent.subtitle,
  ctaLabel = heroContent.primaryCtaLabel,
  ctaHref = '#contact',
}: HeroProps) {
  return (
    <section className={styles.hero} aria-label='Apresentação principal'>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.actions}>
          <Button href={ctaHref} size='lg'>
            {ctaLabel}
          </Button>
          <Button href='#about' variant='secondary' size='lg'>
            {heroContent.secondaryCtaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
