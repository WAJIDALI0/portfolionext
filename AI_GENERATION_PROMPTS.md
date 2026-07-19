# Premium Portfolio Blueprint for AI Code Assistants (Cursor, Antigravity, etc.)

This document contains the **exact, step-by-step master prompts** required to generate a complete, enterprise-grade, high-performance developer portfolio from scratch using any advanced AI coding assistant. 

> **Important for the new user:** Do NOT copy the entire file at once. Paste "Prompt 1" into the AI, wait for it to finish, and then paste "Prompt 2", and so on.

---

## Prompt 1: Project Initialization & Core Architecture

**Copy and paste this into your AI:**

\`\`\`text
You are an expert Full-Stack Software Architect and UI/UX Designer. We are going to build a premium, industry-level developer portfolio.

**Tech Stack:**
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4
- Animations: Framer Motion
- Backend/DB: Supabase (PostgreSQL)
- Auth: @supabase/ssr (Server-Side Authentication)
- Forms: react-hook-form + zod
- Emails: Resend API
- Security: react-google-recaptcha-v3

**Step 1:** Initialize the Next.js project using `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.
**Step 2:** Install `framer-motion`, `lucide-react`, `next-themes`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@supabase/supabase-js`, `@supabase/ssr`, `resend`, and `react-google-recaptcha-v3`.
**Step 3:** Create a central configuration file at `src/config/site.ts`. This file must contain placeholders for my personal data (Name, Bio, GitHub links, Socials, 3 distinct job roles). Use dummy data for now (e.g., "John Doe"), but structure it so I can easily swap in my own details later without touching the UI components.
\`\`\`

---

## Prompt 2: The Premium Design System & CSS Guidelines

**Copy and paste this into your AI:**

\`\`\`text
Now we will define the core design system in `src/styles/globals.css` and the Tailwind configuration.

**Aesthetics & UI Requirements:**
1. **Premium Dark Mode First:** The background should not be pure black. Use a deep, rich custom dark color (e.g., `#09090b` for background, `#18181b` for cards). 
2. **Typography:** Implement a modern sans-serif font (like Inter, Roboto, or Geist). Headings must have tight tracking (`tracking-tight`) and bold weights. Subheadings should be `text-muted-foreground` with relaxed line height (`leading-relaxed`).
3. **Glassmorphism:** Use `backdrop-blur-md` and `bg-background/50` on the Navbar and floating elements to give a translucent, glassy effect.
4. **Borders & Shadows:** Use ultra-subtle borders (`border-white/10`) around cards to create depth. Use soft, glowing shadows (`shadow-primary/20`) when buttons or cards are hovered.
5. **Gradients:** The hero section text should feature a stunning CSS background clip gradient (e.g., `bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent`).
6. **Micro-animations:** Every button must scale down slightly when clicked (`active:scale-[0.98]`) and scale up slightly on hover (`hover:scale-[1.02]`). All transitions must have a duration of 300ms.

Implement this design system across a `Navbar` and `Footer` component now.
\`\`\`

---

## Prompt 3: Building the Public Portfolio Sections

**Copy and paste this into your AI:**

\`\`\`text
Build the public-facing sections of the portfolio using Framer Motion for smooth, staggered scroll animations.

1. **HeroSection:** Create a massive, high-impact hero section filling `min-h-screen`. Include the gradient text heading from the design system, a subheadline pulling from `siteConfig.bio`, and two Call-to-Action buttons ("View Projects", "Contact Me").
2. **About/Skills Section:** Create a 3-column or 4-column grid displaying technical skills. Each card should have an icon from `lucide-react`, a bold heading, and a short description. When hovering over a card, it should gently float up by 5 pixels.
3. **Projects Section:** Build a grid of Project Cards. Each card should feature an image placeholder, tech stack tags (e.g., "Next.js", "MongoDB"), and a "View Case Study" link. 
4. **MDX Integration:** Configure `next-mdx-remote` so that when a user clicks "View Case Study", it dynamically loads a rich Markdown file from a local `content/projects/` folder. This allows me to write long-form, beautiful blog posts about how I built my projects.
\`\`\`

---

## Prompt 4: The Contact Form & Rate Limiter

**Copy and paste this into your AI:**

\`\`\`text
Let's build a highly secure Contact Section.

1. **The Form UI:** Build a Client Component form using `react-hook-form` and `zod` for strict frontend validation. Include fields for Name, Email, and Message. Use a `Loader2` spinning icon inside the Submit button when the form is pending.
2. **Server Action (`actions/contact.ts`):** 
   - Write a Next.js Server Action to process the form.
   - **SECURITY FIRST:** Implement an in-memory IP Rate Limiter. Look at the `x-forwarded-for` header. Limit users to a maximum of 3 messages per hour. If they exceed this, block them and return an error.
   - **Database:** Insert the valid submission into a Supabase `contact_submissions` table.
   - **Email Alert:** Use the `resend` SDK to send an email to the admin. Do NOT use plain text. Build a premium HTML table email template with inline styles, custom branding, and a grey background so it looks professional in Gmail.
\`\`\`

---

## Prompt 5: Secure Admin Dashboard & reCAPTCHA v3

**Copy and paste this into your AI:**

\`\`\`text
Now we will build the private backend infrastructure so the owner can securely manage their messages.

1. **Supabase SSR Setup:** Implement `@supabase/ssr` with a `src/middleware.ts` file that completely blocks access to `/admin` routes unless a valid server-side session cookie exists.
2. **Login Page (`/login`):** 
   - Build a sleek, dark-mode login UI.
   - **reCAPTCHA Integration:** Wrap the page in `react-google-recaptcha-v3`. When the user clicks "Sign In", invisibly generate a token.
   - **Action Security:** In the login Server Action, first verify the reCAPTCHA token with Google. If the score is `< 0.5`, reject the login as a bot. Next, implement a strict IP rate limiter: max 5 failed login attempts per 15 minutes. Finally, authenticate against Supabase via `signInWithPassword`.
3. **Admin Dashboard (`/admin/dashboard`):** Build a protected layout with a sidebar. Display overview metrics (Total Messages, Unread Messages) fetched from the database.
4. **Data View Page (`/admin/contacts`):** Build a beautiful table/card list that displays all entries from the `contact_submissions` table. Include Server Actions to "Mark as Read" and "Delete" (with a loading spinner on the delete button).

*Note to AI: Remind the user to enable Row Level Security (RLS) in their Supabase database to allow `insert` for anonymous users, and `select, update, delete` for authenticated users.*
```

---

## Prompt 6: The Advanced Bonus Features (Redux, Sockets, AI, 2FA)

**Copy and paste this into your AI:**

```text
Let's implement the final advanced bonus features to make this portfolio an absolute masterpiece.

1. **Redux Toolkit Integration:** Install `@reduxjs/toolkit` and `react-redux`. Implement a global UI slice to manage the state of the Chat Widget (open/close) and track unread message counts across the app.
2. **Real-time Live Chat (Supabase Realtime):** Build a floating Chat Widget on the public site and an Admin Chat UI in the dashboard. Use Supabase Realtime channels to broadcast messages instantly between visitors and the admin without page reloads. Include a feature for the admin to permanently end/delete a chat session.
3. **Gemini AI Integration:** Add an "AI Bot" toggle to the visitor Chat Widget. When activated, route visitor messages to a Server Action that securely queries the `gemini-2.0-flash` model. Pre-prompt the AI to act as my personal portfolio assistant using data from my resume.
4. **Two-Factor Authentication (2FA):** Secure the Admin Login by integrating Supabase Native MFA. Generate a TOTP QR code using the `qrcode` library so I can scan it with Google Authenticator. Enforce MFA verification upon login.
```
