import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://madda.dev',
  markdown: {
    smartypants: { dashes: false },
  },
  build: {
    concurrency: 1,
  },
  integrations: [
    starlight({
      title: 'madda',
      description:
        'Scaffold full-stack Next.js apps with the madda stack — typesafe, modular, production-ready.',
      logo: {
        alt: 'madda',
        replacesTitle: false,
        src: './src/assets/logo.svg',
      },
      favicon: '/favicon.svg',
      pagefind: true,
      editLink: {
        baseUrl: 'https://github.com/marcolamr/create-app/edit/main/apps/docs/',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        'pt-br': {
          label: 'Português (BR)',
          lang: 'pt-BR',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/marcolamr/create-app',
        },
        {
          icon: 'npm',
          label: 'npm',
          href: 'https://www.npmjs.com/package/@madda/app',
        },
      ],
      customCss: ['./src/styles/madda.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap',
          },
        },
      ],
      sidebar: [
        {
          label: 'Documentation',
          translations: { 'pt-BR': 'Documentação' },
          items: [{ autogenerate: { directory: 'docs' } }],
        },
        {
          label: 'More',
          translations: { 'pt-BR': 'Mais' },
          items: [
            { label: 'FAQ', link: '/faq', translations: { 'pt-BR': 'FAQ' } },
            {
              label: 'Landing page',
              link: '/',
              translations: { 'pt-BR': 'Página inicial' },
            },
          ],
        },
      ],
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
      },
    }),
  ],
});
