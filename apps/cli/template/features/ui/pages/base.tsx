import Image from 'next/image';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.badge}>Funcionando</span>

        <div className={styles.intro}>
          <p className={styles.eyebrow}>@madda/app</p>
          <h1>Seu app está no ar.</h1>
          <p>
            Scaffold gerado com sucesso. Edite{' '}
            <code className={styles.code}>src/app/page.tsx</code> para começar a
            construir.
          </p>
        </div>

        <div className={styles.brands}>
          <div className={styles.brand}>
            <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js"
              width={100}
              height={20}
              priority
            />
          </div>
          <div className={styles.brand}>
            <Image
              className={styles.logoMark}
              src="/vercel.svg"
              alt="Vercel"
              width={100}
              height={20}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
