# Next.js Application Template

> **Note**: This is a GitHub Template Repository used for automated project creation. When you request a new Next.js application, it will be automatically created from this template with all the configuration and structure already set up.

This is a production-ready Next.js application template with TypeScript, Tailwind CSS, Prisma, and shadcn/ui.

## About This Template

This template is used by the Claude agent system to bootstrap new Next.js projects. Each new project created from this template is an **independent repository** with no git history, giving you a fresh start for your application.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials.

4. Run Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                   # Next.js App Router pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
│   ├── db.ts           # Prisma client
│   ├── utils.ts        # Helper functions
│   └── validations.ts  # Zod schemas
├── prisma/             # Database schema
│   └── schema.prisma
├── types/              # TypeScript types
└── public/            # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database

This project uses PostgreSQL via Prisma. Database connection details are expected in the following environment variables:

- `DATABASE` - Database name
- `USER` - Database user
- `PASSWORD` - Database password
- `HOST` - Database host
- `DATABASE_URL` - Full PostgreSQL connection string

## Adding UI Components

Add shadcn/ui components using:
```bash
npx shadcn-ui@latest add [component-name]
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
