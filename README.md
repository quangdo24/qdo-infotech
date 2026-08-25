# Quang Do — Personal Portfolio

Personal website for [Quang Do](https://github.com/quangdo24) — an IT specialist who builds side projects around AI tooling, networking automation, and small useful software.

Built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion. Project and activity sections pull live data from the GitHub API.

## What's on the site

- **Hero** — intro, bio, and links (GitHub, LinkedIn, email)
- **Projects** — recent public GitHub repositories
- **Recent activity** — latest GitHub events
- **Contact** — ways to get in touch

Site content (name, bio, links, avatar, limits) is centralized in `[siteConfig.ts](siteConfig.ts)`.

## Project structure

```
qdo-infotech/
├── public/
│   └── profile.jpg          # Profile photo used by the avatar
├── components/
│   ├── AmbientBackground.tsx
│   ├── Avatar.tsx
│   ├── Contact.tsx
│   ├── GitHubActivity.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   └── Projects.tsx
├── lib/
│   └── github.ts            # GitHub API helpers (repos + activity)
├── App.tsx                  # Page layout / section composition
├── index.html
├── index.tsx                # React entry point
├── siteConfig.ts            # Name, bio, links, avatar, limits
├── types.ts
├── vite.config.ts
└── package.json
```

## Run locally

**Prerequisite:** Node.js

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Customize

Edit `[siteConfig.ts](siteConfig.ts)`:


| Field                               | Purpose                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `name`, `bio`                       | Hero copy                                                          |
| `avatarSrc`                         | Profile image path (put the file in `/public`, e.g. `profile.jpg`) |
| `email`, `githubUrl`, `linkedinUrl` | Contact / social links                                             |
| `githubUsername`                    | GitHub user used for projects and activity                         |
| `projectsLimit`, `activityLimit`    | How many items to show                                             |


No API keys are required for the public GitHub endpoints used by this site. Requests are cached in `sessionStorage` to stay within rate limits.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS (CDN)
- Framer Motion
- Lucide icons
- GitHub REST API (`lib/github.ts`)

