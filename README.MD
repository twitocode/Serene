
<h1 style="display: flex; align-items: center; justify-content: center;">
  <img style="margin-right: 10px" src="./client/public/mochi/Mochi.svg" align="left" height="46px" alt="Mochi logo"/>
  <span >Serene</span>
</h1>


**Serene** is a mental health and wellness platform designed for **McMaster University** students. It combines evidence-based wellness tools with a user experience to support students throughout their academic journey.

![Serene Platform](https://img.shields.io/badge/Focus-Student_Wellness-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_%7C_ASP.NET_Core-blue)
![Deployment](https://img.shields.io/badge/Deployed-Vercel_%26_Railway-violet)


## Features

### Wellness Hub
- **Health Check-ins**: A system for students to track moods, physical sensations, and thoughts.
<!-- - **Trend Analysis**: Interactive visualizations (Mood Breakdown charts) showing emotional patterns over time. -->
- **Crisis Support**: Immediate access to the McMaster Student Wellness Centre (SWC) and national crisis hotlines.

### Mindful Tools
- **AI Reframing (Mochi)**: Interactive AI-powered reframing tool to help students navigate cognitive distortions.
- **Wellness Checklists**: Self-screening tools to help identify areas needing support.
- **Grounding Sheets**: Digital resources for grounding and mindfulness exercises during high-stress periods.

### Community & Engagement
- **Question of the Day**: A social engagement feature to foster a sense of belonging and shared experience.
- **Achievement System**: Gamified wellness tracking with a day-streak counter and earnable badges.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **State Management**: [Tanstack Query](https://tanstack.com/query) & [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [Tanstack Form](https://tanstack.com/form) + [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://motion.dev/)
- **Icons**: [Iconsax Reactjs](https://github.com/rendinjast/iconsax-reactjs)
- **Deployment**: [Vercel](https://vercel.com/)

### Backend
- **Framework**: [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)
- **ORM**: [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: ASP.NET Core Identity Email/Password   + Google OAuth
- **Deployment**: [Railway](https://railway.app/)



## Getting Started

### Prerequisites
- Node.js / Bun
- .NET 10.0 SDK
- PostgreSQL

### Installation
1. Clone the repository
2. Install client dependencies: `cd client && bun install`
3. Run the client: `bun run dev`
4. Start the server via Visual Studio or `dotnet run` within the server directory.

---
