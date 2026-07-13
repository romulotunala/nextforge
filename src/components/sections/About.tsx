import { aboutContent } from '@/content/home';
import styles from './About.module.scss';

interface AboutProps {
  readonly title?: string;
  readonly description?: string;
}

export function About({
  title = aboutContent.title,
  description = aboutContent.description,
}: AboutProps) {
  return (
    <section id='about' className={styles.about} aria-label='Propósito do template'>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <ul className={styles.highlights}>
            {aboutContent.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div className={styles.note}>
          <h3>{aboutContent.noteTitle}</h3>
          <p>
            {aboutContent.noteDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
