# OWL Bot

<p align="center">
  <img src="https://owl.lux.dev/owlbot.png" alt="OWL Bot" width="200" />
</p>

![Website](https://img.shields.io/website?label=API%20Status&style=for-the-badge&labelColor=000&up_message=Operational&url=https%3A%2F%2Fowl-api.lux.dev)
![Website](https://img.shields.io/website?style=for-the-badge&labelColor=000&up_message=Operational&url=https%3A%2F%2Fowl.lux.dev)
[![GitHub followers](https://img.shields.io/github/followers/lucasdoell?logo=github&style=for-the-badge&labelColor=000)](https://github.com/lucasdoell)

This is the repository for the OWL Bot, a Discord bot that provides information about the Overwatch League.

## What's inside?

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `bot`: a Discord bot powered by [discord.js](https://discord.js.org/)
- `server`: an Express server that hosts the OWL API
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is primarily [TypeScript](https://www.typescriptlang.org/). The Discord bot is written in JavaScript.

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd owlbot
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd owlbot
npm run dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd owlbot
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
