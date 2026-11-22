# PYQmate

**A Previous Year Question Paper Finder for SRM Institute of Science and Technology Students.**

PYQmate is a platform that helps SRM students discover and access previous-year question papers. Search courses by code or name, browse subjects by semester, filter papers by examination year and term, preview and download PDFs, bookmark important papers, and revisit recently viewed papers.

Built using **React, Vite, Tailwind CSS v4, React Router, and Lucide Icons**, with data fetched from the public, read-only SRM PYQ API.

---

## Features

- **Course Search:** Search courses by course code or name with debounced requests.
- **Pagination:** Load more courses as needed.
- **Semester Browsing:** Explore courses grouped by semester using available API data.
- **Course Details:** View available question papers for individual courses.
- **Paper Filters:** Filter question papers by examination year and term.
- **PDF Preview:** Preview question papers directly in the browser.
- **PDF Download:** Download question papers using fresh download URLs.
- **Bookmarks:** Save important question papers for quick access.
- **Recently Viewed:** Automatically maintain a history of the last 12 viewed papers.
- **Persistent Storage:** Bookmarks and browsing history are saved in browser localStorage.
- **Responsive Design:** Optimized for desktop and mobile devices, with a mobile drawer menu.
- **Error Handling:** Loading, empty and error states with retry functionality.

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

Clone the repository and navigate to the project directory.

```bash
git clone <repository-url>
cd pyqmate
```

Install dependencies:

```bash
npm install
```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open the application at:

`http://localhost:5173`

### Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production build in `dist/` |
| `npm run preview` | Preview the production build locally |

**Note:** `npm run preview` does not use the development proxy described below. API requests may therefore fail in local preview mode. Use `npm run dev` for local development and testing, or deploy through Vercel.

---

## Project Structure

```text
PYQmate/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── CourseCard.jsx
│   │   ├── PaperCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── LoadingSkeleton.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CourseExplorer.jsx
│   │   ├── SemesterBrowser.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── PaperViewer.jsx
│   │   └── Library.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │   ├── useCourses.js
│   │   └── useStore.js
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── storage.js
│   │   └── download.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
└── README.md
```

---

## API Integration

PYQmate uses the **SRM PYQ API**, a public, read-only REST API that provides access to SRM course information and previous-year question papers.

**Base URL:**

```text
https://srm-pyq-api.onrender.com
```

**Authentication:** Not required.

### API Endpoints

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check API availability |
| GET | `/v1/courses` | Search and retrieve courses |
| GET | `/v1/courses/{course_code}` | Retrieve individual course details |
| GET | `/v1/courses/{course_code}/papers` | Retrieve papers for a course |
| GET | `/v1/papers/{paper_id}` | Retrieve individual paper details |
| GET | `/v1/papers/{paper_id}/files` | Retrieve attached PDF metadata |
| GET | `/v1/files/{file_id}/download` | Generate a fresh download URL |

### API Features Used

- Course search using the `q` parameter.
- Cursor-based pagination using `cursor` and `limit`.
- Examination year filtering using `year`.
- Examination term filtering using `term`.
- PDF file identification using file metadata.
- Fresh signed download URL generation.

### Important Implementation Details

1. **URL Encoding:** Course codes are URL-encoded before API requests because some course codes contain special characters, including commas.

2. **Signed Download URLs:** Download URLs may expire. PYQmate requests a fresh URL whenever a paper is opened or downloaded. Signed URLs are never permanently stored.

3. **Request Retries:** Network errors and HTTP 5xx responses are retried using exponential backoff. HTTP 404 and 422 responses are not retried.

4. **Request Deduplication:** Identical simultaneous requests are merged to avoid unnecessary API calls.

5. **Semester and Examination Filters:** The API does not provide a dedicated semester filter or a separate list of available examination years and terms. These are derived from the course and paper data loaded by the application.

6. **API Availability:** The free Render server may sleep when idle. Consequently, the first API request can take several seconds.

---

## Why a Proxy Is Used

Browsers may block cross-origin requests when the external API does not provide the required CORS headers.

To handle this, PYQmate uses a proxy:

```text
Frontend
   |
   v
/api/...
   |
   v
Proxy / Rewrite
   |
   v
https://srm-pyq-api.onrender.com
```

### Local Development

The API proxy is configured in:

```text
vite.config.js
```

### Vercel Deployment

The API rewrite is configured in:

```text
vercel.json
```

If deploying through another hosting provider, configure an equivalent proxy or rewrite rule.

---

## Deployment on Vercel

PYQmate can be deployed using Vercel.

### Steps

1. Push the project repository to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Select **Add New Project**.
4. Import the PYQmate GitHub repository.
5. Select the Vite framework preset.
6. Verify the build settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

7. Click **Deploy**.

No environment variables are required for the current implementation.

The `.gitignore` file excludes `node_modules`, `dist`, and `.env` files from version control.

---

## Privacy and Security

PYQmate is designed to minimize data collection and protect user privacy.

- No user accounts or login system.
- No SRM login credentials are requested.
- No API keys or private credentials are required.
- No analytics or tracking scripts.
- Bookmarks and browsing history are stored locally in the user's browser using localStorage.
- Clearing browser data removes locally stored bookmarks and history.
- Only paper and course metadata is stored; temporary signed download URLs are never persisted.
- API-provided text is rendered through React.
- `dangerouslySetInnerHTML` is not used.

**Possible future improvement:** Add a Content Security Policy (CSP) header through `vercel.json` for additional browser-side security.

---

## Known Limitations

- Semester groups depend on the semester information returned by the API. Courses without semester information appear under **Semester not specified**.
- Some mobile browsers may not support embedded PDF previews. Users can use the Download button instead.
- The API does not expose a dedicated semester filter or complete list of available examination years and terms.
- Toast notifications have not yet been implemented.
- Bookmarks and recently viewed history are browser-specific and are not synchronized across devices.

---

## Credits and Acknowledgements

Course information and question paper data are provided by the **SRM PYQ API**.

PYQmate is an independent student-developed project and is **not affiliated with, endorsed by, or officially associated with SRM Institute of Science and Technology**.

---

**PYQmate — Making exam preparation a little easier.**
