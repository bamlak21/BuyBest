# 🛍️ Hanger - Next.js E-commerce

A modern e-commerce application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- Product browsing with search and categories
- Product details with image gallery
- Favorites system
- CRUD operations for products
- Dark mode support
- Responsive design
- Toast notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Shadcn UI
- **State**: Redux Toolkit
- **API**: DummyJSON via Axios
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📦 Installation

```bash
git clone <repo-url>
cd hanger
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
src/
├── app/                     # Next.js pages
├── components/              # React components
│   ├── ui/                 # Shadcn UI
│   └── [custom components]
├── lib/                    # Utilities & API
├── store/                  # Redux store
└── types/                  # TypeScript types
```

## 🎨 UI Components

**Shadcn UI**: Button, Card, Dialog, Input, Label, Loading Spinner, Sonner

**Custom**: ProductCard, ProductList, ConfirmDialog, ThemeToggle, ProtectedRoute

## 🔄 State Management

Redux Toolkit manages:
- Authentication state
- Product favorites
- Theme preferences

## 🌐 API

Uses DummyJSON API for:
- Product CRUD operations
- Search and filtering
- Category management

## 🔧 Scripts

- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - Code linting

## 🚀 Deployment

Ready for Vercel, Netlify, or other static hosting platforms.

## 📄 License

MIT License