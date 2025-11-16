# EventFlow: AI-Assisted Event Planner

**EventFlow** is a smart event planning application built for the TanStack Start Hackathon v1. It streamlines event organization by using AI to generate intelligent agendas based on user preferences, which participants can then collaboratively refine in real-time.

## Core Idea

The goal is to move beyond simple event creation. Users define an event (e.g., "Team Offsite," "Product-Sync Meeting"), set parameters (duration, goals, tone: 'formal' or 'casual'), and EventFlow's AI assistant suggests a detailed, itemized agenda. This draft is then shared with participants who can vote on, suggest changes to, or drag-and-drop reorder agenda items.

## Features

- **Authentication**: Secure user login and registration using clerk.

- **Event Dashboard**: A clean, card-based view of all upcoming and past events.

- **AI Agenda Generation**: On event creation, users can input preferences, and an AI (via Gemini API) will propose a structured agenda.

- **Collaborative Agenda Editor**: A real-time, interactive timeline/list where participants can:

  - Vote on proposed agenda items.

  - Suggest new items.

  - Drag-and-drop to reorder the schedule.

- **Real-time Updates**: Uses ConvexDB to ensure all participants see changes to the agenda and votes instantly.

- **Modern UI**: Built with a stunning, responsive theme using Tailwind CSS, shadcn/ui, and Aceternity UI.

## Tech Stack

- **Framework**: TanStack Start

- **UI**: React, Tailwind CSS

- **UI Components**: shadcn/ui, Aceternity UI

- **API & Type-Safety**: ConvexDB

- **Authentication**: Clerk

- **Database**: ConvexDB

- **AI**: Google Gemini API (for agenda generation)

## Getting Started

### Prerequisites

- Node.js (v23+)

- pnpm (recommended)

- ConvexDB Database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JealousGx/EventFlow.git
cd EventFlow
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a .env file by copying .env.example. This will include keys for your database connection, authentication (clerk), and the Google Gemini API.

```bash
cp .env.example .env
```

Fill in the necessary values in `.env`.

4. Push the database schema:

For Local:

```bash
npx convex dev
```

For Production:

```bash
npx convex deploy

```

5. Run the development server:

```bash
pnpm dev
```

The application will be available at http://localhost:3000.
