# BrightSteps 

An AI-powered early autism screening and therapy management platform. Parents complete structured developmental screenings and upload behavioural videos from home. Gemini 2.5 analyses those videos for key indicators, fuses the results with questionnaire scores into a unified risk assessment, and clinicians review cases and manage therapy — 
all in one platform.

## 🔗 Live Demo & Resources

- **Live App**: [brightsteps-asd.vercel.app](https://brightsteps-asd.vercel.app/)
- **Repository**: [github.com/awyushhk/Bright-Steps](https://github.com/awyushhk/Bright-Steps)
- **Developer**: [Ayush](https://linkedin.com/in/ayush-kumar100)

## ✨ Features

- **Age-Calibrated Screening** — Questionnaires across 4 age groups (6–60 months), M-CHAT-R inspired
- **AI Video Analysis** — Gemini 2.5 Flash scores 5 behavioural indicators from uploaded home videos
- **Risk Fusion Engine** — Combines questionnaire (60%) + AI video scores (40%) into Low / Medium / High risk
- **Clinician Case Queue** — Priority-sorted dashboard, deduplicated to latest screening per child
- **5-Tab Case Review** — Overview, Questionnaire, Videos, Clinical Review, Therapy Plan
- **Therapy Management** — Clinicians create plans; parents log sessions with behaviour ratings
- **Progress Tracking** — Auto trend classification (Improving / Stagnant / Regressing) after every session
- **Smart Alerts** — Regression alerts on clinician dashboard with duplicate suppression
- **Analytics Dashboard** — Risk distribution, screening trends, indicator averages, case status funnel
- **Role-Based Access** — Three-layer security for parent and clinician roles

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Clerk account
- NeonDB database
- Cloudinary account
- Google Gemini API key

### Installation
```bash
git clone https://github.com/awyushhk/Bright-Steps.git
cd Bright-Steps
npm install
```

Create a `.env.local` file:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# NeonDB
DATABASE_URL=your_neondb_connection_string

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini
GEMINI_API_KEY=your_gemini_api_key
```

### Running the Application
```bash
npm run dev
```

Then initialise the database:
```
http://localhost:3000/api/db-init
```

Open `http://localhost:3000`

## 📂 Project Structure
```
autism-screening-app/
├── app/
│   ├── (dashboard)/dashboard/
│   │   ├── layout.jsx                       # Shared dashboard shell
│   │   ├── page.jsx                         # Role-based redirect
│   │   ├── parent/
│   │   │   ├── page.jsx                     # Parent dashboard
│   │   │   ├── screening/[childId]/page.jsx # Questionnaire + video upload
│   │   │   ├── screening/result/[screeningId]/page.jsx
│   │   │   └── therapy/[planId]/page.jsx    # Parent therapy page
│   │   ├── clinician/
│   │   │   ├── page.jsx                     # Clinician case queue
│   │   │   ├── analytics/page.jsx           # Analytics dashboard
│   │   │   ├── case/[caseId]/page.jsx       # 5-tab case review
│   │   │   ├── therapy-overview/page.jsx    # All therapy plans
│   │   │   └── therapy/[planId]/page.jsx    # Clinician therapy page
│   │   └── components/
│   │       ├── ProgressChart.jsx            # Recharts AreaChart
│   │       └── TherapyAlertsPanel.jsx       # Unread alerts panel
│   ├── api/
│   │   ├── auth/set-role/route.js
│   │   ├── children/route.js
│   │   ├── children/[childId]/route.js
│   │   ├── screenings/route.js
│   │   ├── screenings/[screeningId]/route.js
│   │   ├── therapy/plans/route.js
│   │   ├── therapy/plans/[planId]/route.js
│   │   ├── therapy/sessions/route.js
│   │   ├── therapy/progress/route.js
│   │   ├── therapy/alerts/route.js
│   │   ├── upload-video/route.js
│   │   └── db-init/route.js
│   ├── page.jsx                             # Homepage
│   └── layout.jsx                           # Root layout (ClerkProvider)
├── lib/
│   ├── db.js                                # NeonDB connection
│   ├── queries.js                           # Screening & children SQL
│   ├── therapy-queries.js                   # Therapy SQL + progress engine
│   ├── riskEngine.js                        # Risk fusion algorithm
│   ├── gemini.js                            # Gemini video analysis client
│   └── cloudinary.js                        # Cloudinary config
├── components/ui/                           # shadcn/ui components
├── middleware.ts                            # Clerk session validation
└── next.config.mjs
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Clerk |
| Database | NeonDB (PostgreSQL) |
| AI Analysis | Google Gemini 2.5 Flash |
| Media Storage | Cloudinary |
| Charts | Recharts |
| Deployment | Vercel |

## 🔌 API Integrations

| Service | Purpose |
|---------|---------|
| Clerk | Authentication, sessions, role metadata |
| NeonDB | Serverless PostgreSQL — all application data |
| Cloudinary | Video upload, MP4 compression, CDN delivery |
| Gemini 2.5 | Multimodal behavioural video analysis |

## 🤔 Challenges & Solutions

**Serverless timeout on video analysis** — Vercel's 60s limit was exceeded during video fetch + base64 conversion + Gemini call. Fixed with `maxDuration = 300`, a 30s AbortController on video fetch, and Cloudinary compression reducing download size.

**NeonDB serverless connections** — Traditional TCP connections leak in serverless. NeonDB's HTTP-based driver pools connections at the infrastructure level, compatible with Vercel's serverless model.

## 🔮 Future Enhancements

- Email notifications for alerts
- Longitudinal risk trajectory chart across multiple screenings
- Dedicated therapist role separate from clinician
- TypeScript migration with Zod runtime validation
- Fine-tuned domain-specific AI model for higher accuracy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ by [Ayush](https://linkedin.com/in/ayush-kumar100)
