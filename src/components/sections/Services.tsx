import {
  servicesContent,
  type HomeServiceItem,
} from '@/content/home';
import styles from './Services.module.scss';

interface ServicesProps {
  readonly title?: string;
  readonly services?: readonly HomeServiceItem[];
}

export function Services({
  title = servicesContent.title,
  services = servicesContent.items,
}: ServicesProps) {
  return (
    <section id='services' className={styles.services} aria-label='Recursos do template'>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.title} className={styles.card}>
              <span className={styles.icon} aria-hidden='true'>
                {service.icon}
              </span>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
