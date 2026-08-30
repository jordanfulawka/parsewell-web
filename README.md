# Parsewell

Parsewell is a job application tracker that uses AI to tailor your resume to each posting. Paste a job link, and it scrapes the posting, drafts the application record, suggests targeted resume edits with reasoning for each one, and generates a cover letter grouded in your actual experience.

This repository contains the React frontend. The Spring Boot API lives in [parsewell-api](https://github.com/jordanfulawka/parsewell-api).

**Live app**: [parsewell.app](https://parsewell.app/) (Please note I am not currently accepting public sign-ups at this moment due to API costs).

![Applications List Page](/public/readme-imgs/application-list-page.png)

## Features

**Base resume as the source of truth.** Upload a resume once and it is stored in S3 through presigned URLs, so the file never passes through the API server. Every tailoring request works from this document. Creating applications is gated until a base resume exists.

**Job posting parsing.** Paste a posting URL and the backend scrapes it, then returns a draft application with company, role, location, and full job description pre-filled. A review step lets you correct anything before saving, and manual entry is available for postings behind logins or job boards that block scrapers.

**Resume edit suggestions.** For a saved application, Parsewell returns a list of suggested edits, each with the original text, the rewritten text, the section it belongs to, an edit type, and the reasoning behind the change. Suggestions are advisory, so you stay in control of what actually goes into the resume.

**Cover letter generation.** Generates a draft cover letter for a specific application using the base resume and the parsed job description.

**Application pipeline tracking.** Each application moves throu `Applied`, `Heard Back`, `Rejected`, and `Ghosted`. The list view supports search across company, role, and location, plus sorting by recently updated, newest, oldest, or company name. There are also buttons to only view applications of a certain status. Search and sort preferences persist across sessions.

**Submitted materials.** Attach the exact resume and cover letter you sent for each application, uploaded and retrieved through presigned S3 URLs, so there is a record of which version went out.

**Insights.** Total applications, applications in the past week, and a breakdown by status.

## Screenshots

![Login Page](/public/readme-imgs/login-page.png)

![Add Application Page](/public/readme-imgs/add-application-page.png)

![Application Review Form](/public/readme-imgs/application-review-page.png)

![Application Details Page](/public/readme-imgs/application-details-page.png)

![Generated Cover Letter Page](/public/readme-imgs/generated-coverletter-page.png)

![Insights Page](/public/readme-imgs/insights-page.png)

## Tech Stack

| Layer          | Choice                             |
| -------------- | ---------------------------------- |
| Framework      | React 19 with TypeScript           |
| Build tool     | Vite 8                             |
| Routing        | React Router 8                     |
| Server state   | TanStack Query 5                   |
| Styling        | Tailwind CSS 4 via the Vite plugin |
| Icons          | Lucide                             |
| Error handling | react-error-boundary               |
| Hosting        | Render                             |

## Architecture

The frontend is a static SPA that talks to a Spring Boot API over REST. Authentication uses a JWT issues by the API and held in `localStorage`. `AuthContext` decodes the token payload to derive the current user and schedules an automatic logout at the token's expiry, so a stale session is cleared without waiting for the next failed request. `ProtectedRoutes` renders an `Outlet` when a token is present and redirects to the login page otherwise.

Server state is handled by TanStack Query rather than manual effects. Query keys include the token so that cached data is scoped to a session and does not lead across logins. Data access is grouped into hooks that own theire own query and cache invalidations.

- `useApplications` fetches the application list and derives the status buckets, the past-week count, and the filtered and sorted view in a single memo.
- `useApplication` fetches one application and exposes a status update mutation.
- `useEditSuggestion` fetches the resume edit suggestions for an application
- `useCoverLetter` fetches the generated cover letter for an application

All HTTP calls live in `src/lib/api.ts`, which normalizes error responses into `Error` instances with a usable message, falling back to the status text when the body is not JSON.

File transfers bypass the API entirely. The client asks the backend for a presigned S3 URL, then `PUT`s the file directly to S3 and reports the filename back to the API. Downloads follow the smae pattern in reverse with a presigned `GET`. This keeps large uploads off the application server and avoids proxying binary data through Fargate.

Long-running AI calls are synchronous, so the UI covers them with a dedicated loading screen that cycles through stage-specific messages defined in `src/lib/loadingMessages.ts`. Shorted fetches use per-section skeletons rather than a blocking spinner.

## Project structure

```
src/
├── assets/fonts/     Self-hosted Nunito variable font
├── boundaries/       Root error boundary fallback
├── components/       Reusable UI (badges, list items, error banner, route guard)
├── contexts/         AuthContext and useAuth
├── hooks/            TanStack Query data hooks
├── lib/              API client, shared types, loading copy, utilities
├── pages/            Route-level components
└── skeletons/        Per-section loading placeholders
```

## Routes

| Path                             | Page                                                   |
| -------------------------------- | ------------------------------------------------------ |
| `/login`                         | Sign in and register                                   |
| `/applications`                  | List, search, sort, base resume management             |
| `/applications/new`              | Paste a job URL or choose manual entry                 |
| `/applications/review/:id?`      | Review a parsed draft or enter details manually        |
| `/applications/:id`              | Details, status, edit suggestions, submitted materials |
| `/applications/:id/cover-letter` | Generated cover letter                                 |
| `/insights`                      | Application activity summary                           |

## Getting started

### Prerequisites

- Node.js 20 or later
- A running instances of the Parsewell API

### Setup

```bash
git clone https://github.com/jordanfulawka/parsewell-web.git
cd parsewell-web
npm install
```

Create a .env file in the project root:
`VITE_BASE_URL=http://localhost:8080`

Point this at your local API during development, or at the deployed API base URL for a production build.

### Run

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the View dev server with HMR             |
| `npm run build`   | Type check with `tsc -b`, the build to `dist/` |
| `npm run preview` | Serve the production build locally             |
| `npm run list`    | Run ESLint                                     |

## Deployment

The frontend is deployed to Render as a static build.

| Setting              | Value                                              |
| -------------------- | -------------------------------------------------- |
| Build command        | `npm run build`                                    |
| Output directory     | `dist`                                             |
| Environment variable | `VITE_BASE_URL` set to the production API base URL |

Because VITE_BASE_URL is inlined at build time, changing it requires a redeploy rather than a restart. Client-side routing needs a catch-all rewrite to `/index.html` so that direct navigation to a deep link does not 404.

## Design

Warm cream background with sage green and clay accents, set in Nunito. The font is self-hosted as a variable font rather than loaded from a CDN, which removes a third-party request from the critical path.

| Token        | Value                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| Background   | ![#F7F2EA](https://img.shields.io/badge/-F7F2EA-F7F2EA?style=flat-square) |
| Surface      | ![#FDFBF8](https://img.shields.io/badge/-FDFBF8-FDFBF8?style=flat-square) |
| Primary text | ![#4A3E37](https://img.shields.io/badge/-4A3E37-4A3E37?style=flat-square) |
| Sage accent  | ![#7FA687](https://img.shields.io/badge/-7FA687-7FA687?style=flat-square) |
| Clay accent  | ![#BC7F53](https://img.shields.io/badge/-BC7F53-BC7F53?style=flat-square) |

## Readmap

- Responsive layout for narrow viewports
- Export tailed resumes directly rather than relying on manual re-upload
