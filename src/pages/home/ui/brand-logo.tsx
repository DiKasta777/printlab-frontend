import styles from '../styles/home-page.module.css';

export function BrandLogo() {
  return (
    <svg className={styles['home-page__logo']} viewBox="0 0 90 100" aria-hidden="true">
      <defs>
        <linearGradient id="brand-orange">
          <stop stopColor="#ec4c1c" />
          <stop offset="1" stopColor="#ff7d16" />
        </linearGradient>
      </defs>
      <path
        fill="url(#brand-orange)"
        d="M28 4h43q12 0 12 12v27H61V25H36v48h18q-8-17 4-24 15-7 24 9l7 19q4 14-12 14H51l8 7H43l-9-9h-7Q4 89 4 67V27Q4 4 28 4Z"
      />
      <path d="M67 23v14" stroke="#ff7d16" strokeWidth="7" strokeLinecap="round" />
      <path d="M27 87v7h12" fill="none" stroke="#f56817" strokeWidth="6" strokeLinecap="round" />
      <circle cx="73" cy="69" r="5" fill="white" />
      <circle cx="74" cy="69" r="2.5" fill="#22c9c8" />
    </svg>
  );
}
