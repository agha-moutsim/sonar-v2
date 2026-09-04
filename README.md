# SONAR — Your Gateway to Web3

Replacing complex blockchain addresses with simple, secure usernames.

**Live site:** [https://nexora-app-inky.vercel.app](https://nexora-app-inky.vercel.app)

## About

SONAR is a Web3 landing experience that introduces decentralized identities (SONAR IDs), a cross-chain wallet, and the upcoming SONAR Hub. The page is a dark, motion-rich single-page site built around a 3D particle shark hero and a series of interactive product sections.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Three.js** — particle-shark hero (InstancedMesh, EffectComposer + UnrealBloomPass, camera auto-fit, ResizeObserver-driven responsive rendering)
- **GSAP** — scroll-driven animations (roadmap pinning, reveals)
- **Framer Motion** — component transitions
- **Lucide React** — icons

## Sections

| Section | Description |
| --- | --- |
| Landing Hero | 3D particle shark formation, ghost title, world-map ID card |
| Problem / Solution | The complexity of crypto and how SONAR removes it |
| SONAR IDs | One username that routes every chain |
| Chain Video | "One Name. Multiple Chains." 3D showcase |
| Claim ID | Interactive username claim demo |
| Ecosystem Integration | Wallet / DEX / CEX / gaming integration story |
| SONAR Hub | Upcoming product preview (coming soon) |
| SONAR Wallet | Wallet with native SONAR ID integration |
| Wallet Features | Feature highlights and live identity demo |
| Roadmap | 2025 phased rollout timeline |
| Team | The crew behind SONAR |
| Partners | Ecosystem partners marquee |
| Footer | Community links and closing transmission |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
app/                  # App Router: layout, page, global styles
components/           # One component per landing section + hero assets
lib/                  # Three.js particle swarm (shark), shared helpers
public/               # Static images, logos, video
```

## Deployment

The site deploys to Vercel from the `main` branch:

- **Production:** [https://nexora-app-inky.vercel.app](https://nexora-app-inky.vercel.app)

## Repository

[https://github.com/agha-moutsim/sonar-v2](https://github.com/agha-moutsim/sonar-v2)
