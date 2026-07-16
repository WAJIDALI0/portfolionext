<div align="center">
  <h1 align="center">Next.js Premium Portfolio</h1>
  <p align="center">
    A high-performance, aesthetically premium developer portfolio built with the modern MERN/Next.js stack.
  </p>
</div>

---

## ✨ Features

- **Blazing Fast Performance**: Built on Next.js 16 (App Router) with Turbopack for near-instant load times.
- **Premium Design Aesthetics**: Carefully crafted UI using Tailwind CSS v4, featuring a sleek dark mode, glassmorphism, and subtle micro-animations.
- **Dynamic Content Architecture**: Case studies and project details are powered by local MDX files, allowing for rich, content-heavy project pages with markdown support.
- **Robust Form Handling**: Fully validated contact form using `react-hook-form` and `zod`.
- **Backend Integration**: 
  - Submissions are securely stored in **Supabase** via the `@supabase/supabase-js` client.
  - Real-time email notifications are sent via the **Resend API**.
- **Interactive UI Components**: Leveraging `framer-motion` for fluid scroll animations, page transitions, and interactive elements.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Email Service**: [Resend](https://resend.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content**: MDX (Markdown + JSX)

## 🚀 Getting Started

### 1. Clone & Install Dependencies
\`\`\`bash
git clone <repository-url>
cd portfolionext
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env.local\` file in the root directory and add your keys:

\`\`\`env
# Supabase Configuration (REST API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend Configuration
RESEND_API_KEY=re_your_api_key
RESEND_TARGET_EMAIL=your-email@example.com
\`\`\`

### 3. Database Setup (Supabase)
Run the following SQL in your Supabase SQL Editor to create the contact table:

\`\`\`sql
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Allow anyone to insert contact submissions from your website
create policy "Allow public inserts" on contact_submissions
  for insert to anon with check (true);
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`text
src/
├── app/              # Next.js App Router (pages, layouts, server actions)
├── components/       # Shared UI components (navbar, footer, ui elements)
├── config/           # Site configuration (personal data, links, projects list)
├── features/         # Feature-based component slicing (home, contact)
├── lib/              # Utility functions and clients (Supabase, MDX processor)
└── styles/           # Global styles and Tailwind entry points
content/
└── projects/         # MDX files containing detailed case studies
\`\`\`

## 📝 License

This project is licensed under the MIT License.
