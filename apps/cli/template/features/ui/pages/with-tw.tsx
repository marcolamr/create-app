import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 bg-white px-6 py-12 sm:px-16 sm:py-28 dark:bg-zinc-950">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
            <span className="size-2 rounded-full bg-current" aria-hidden />
            Funcionando
          </span>
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-400">
            Tailwind CSS
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-widest text-violet-600 uppercase dark:text-violet-400">
            @madda/app
          </p>
          <h1 className="max-w-md text-4xl leading-tight font-semibold tracking-tight text-balance text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Seu app está no ar.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-balance text-zinc-600 dark:text-zinc-400">
            Scaffold gerado com sucesso. Edite{' '}
            <code className="rounded-md bg-violet-100 px-2 py-0.5 font-mono text-sm text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              src/app/page.tsx
            </code>{' '}
            para começar a construir.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Tema claro/escuro via{' '}
            <code className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
              dark:
            </code>{' '}
            — segue a preferência do sistema.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <Image
            className="h-5 w-auto dark:invert"
            src="/next.svg"
            alt="Next.js"
            width={100}
            height={20}
            priority
          />
          <Image
            className="h-5 w-auto dark:invert"
            src="/vercel.svg"
            alt="Vercel"
            width={100}
            height={20}
          />
        </div>
      </main>
    </div>
  );
}
