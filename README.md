# 🛡️ RepoGuardian

**RepoGuardian** is an AI-powered GitHub repository health monitoring tool. It analyzes your repositories using commit history and Google Gemini AI to generate quality scores, actionable improvement suggestions, security concerns, and visual commit trend charts — all updated automatically every day.

---

## ✨ Features

- 🔐 **GitHub OAuth Login** — Secure sign-in with your GitHub account
- 📊 **AI-Powered Analysis** — Powered by Google Gemini, generates quality reviews, improvement suggestions, and security insights from commit history
- 🏥 **Health Score System** — A weighted composite score based on:
  - **AI Score** (50%) — Gemini's assessment of commit quality and clarity
  - **Consistency Score** (30%) — Commits-per-week over the repo's history
  - **Activity Score** (20%) — Recency of the last commit
- 📈 **Commit Activity Charts** — Interactive line charts with Daily / Weekly / Monthly views
- 🔁 **Compare Repositories** — Side-by-side comparison of health scores, AI summaries, and activity status
- ⏰ **Automated Daily Analysis** — Cron job runs at midnight to auto-analyze all monitored repositories
- 🗂️ **Report History** — View, manage, and delete past analysis reports per repository

---

## 🖥️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Chart.js |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose)                  |
| AI        | Google Gemini API (`@google/generative-ai`) |
| Auth      | GitHub OAuth                        |
| Scheduler | node-cron                           |

---

## 📁 Project Structure

```
RepoGuardian/
├── backend/
│   ├── cron/
│   │   └── scheduler.js        # Daily auto-analysis cron job
│   ├── models/
│   │   ├── Repo.js             # Repository schema
│   │   ├── Report.js           # Analysis report schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── auth.js             # GitHub OAuth routes
│   │   ├── repo.js             # Repository management routes
│   │   └── analysis.js         # Analysis & comparison routes
│   ├── services/
│   │   ├── aiService.js        # Gemini AI integration
│   │   └── githubService.js    # GitHub API integration
│   ├── .env.example
│   └── server.js               # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── HealthScore.jsx
    │   │   ├── Loader.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── RepoCard.jsx
    │   │   └── ReportCard.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── RepoSelect.jsx
    │   │   ├── RepoAnalysis.jsx
    │   │   └── CompareRepos.jsx
    │   ├── services/
    │   │   └── api.js          # Axios API service layer
    │   └── App.jsx
    └── index.html
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [GitHub OAuth App](https://github.com/settings/developers)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/RepoGuardian.git
cd RepoGuardian
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
MONGO_URI=mongodb://localhost:27017/repoguardian
CLIENT_ID=your_github_oauth_client_id
CLIENT_SECRET=your_github_oauth_client_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## 🔑 GitHub OAuth Configuration

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Set the **Homepage URL** to `http://localhost:5173`
3. Set the **Authorization callback URL** to `http://localhost:5000/auth/github/callback`
4. Copy the **Client ID** and **Client Secret** into your backend `.env`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/github` | Redirect to GitHub OAuth |
| GET | `/auth/github/callback` | GitHub OAuth callback |

### Repositories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/repo/:userId` | Get monitored repos for a user |
| POST | `/repo/add` | Add a repo to monitoring |
| DELETE | `/repo/:repoId` | Remove a repo from monitoring |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analysis/trigger/:repoId` | Manually trigger AI analysis |
| GET | `/analysis/history/:repoId` | Get analysis report history |
| GET | `/analysis/commits/:repoId` | Get commit trend data |
| GET | `/analysis/compare/:repoId1/:repoId2` | Compare two repositories |
| DELETE | `/analysis/:reportId` | Delete a specific report |

---

## 🏥 Health Score Formula

```
Final Score = (AI Score × 0.5) + (Consistency Score × 0.3) + (Activity Score × 0.2)
```

| Component | Criteria |
|-----------|----------|
| **AI Score** | Gemini's rating based on commit message quality & patterns |
| **Consistency** | ≥10 commits/week → 100 · ≥5 → 80 · ≥2 → 60 · <2 → 40 |
| **Activity** | Last commit ≤3 days → 100 · ≤7 → 90 · ≤14 → 70 · ≤30 → 50 · older → 20 |

---

## 🤖 AI Analysis Output

Each analysis report includes:

- **Quality Review** — 2-sentence summary of code activity quality
- **Suggestions** — 3 actionable improvement recommendations
- **Security Concerns** — Potential issues flagged from commit patterns
- **Score** — AI's raw health score (0–100)

---

## ⏰ Automated Scheduling

RepoGuardian runs a background cron job every day at **midnight** that:
1. Fetches all active monitored repositories
2. Retrieves the latest 100 commits from GitHub
3. Sends data to Gemini for analysis
4. Saves a new report and updates the repo's health score

---

## 🙌 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ to help developers keep their repositories healthy and maintainable.
