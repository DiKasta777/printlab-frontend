import { env } from '@/shared/config/env';
import styles from './home-page.module.css';

export function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href={import.meta.env.BASE_URL}
          aria-label={`${env.appName} — главная`}
        >
          <svg className={styles.logo} viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="m20 4 14 8v16l-14 8-14-8V12l14-8Z" />
            <path d="m6 12 14 8 14-8M20 20v16M13 8l14 8" />
          </svg>
          {env.appName}
        </a>
        <span className={styles.label}>Лаборатория 3D-печати</span>
      </header>
      <main id="main-content" className={styles.main}>
        <p className="eyebrow">От идеи к объёму</p>
        <h1>
          Ваше пространство
          <br />
          для 3D-печати.
        </h1>
        <p className={styles.description}>
          {env.appName} начинается здесь. Мы создаём удобное место для работы с принтером, моделями
          и задачами печати.
        </p>
        <div className={styles.notice}>
          <span className={styles.dot} aria-hidden="true" />
          Приложение в разработке
        </div>
      </main>
      <footer className={styles.footer}>
        <span>{env.appName}</span>
        <span>Слой за слоем.</span>
      </footer>
    </div>
  );
}
