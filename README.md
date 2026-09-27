# ShopFlow

Full-stack e-commerce platform built with React, TypeScript, Node.js, Express, Prisma and PostgreSQL.

ShopFlow is a portfolio project focused on building a scalable e-commerce application with a modern storefront, dynamic product architecture, authentication, catalog filtering, multilingual support and an administrative panel.

## Demo

**Live Demo:** `https://shopflow-six-psi.vercel.app`

**Backend API:** `https://shopflow-it20.onrender.com`

## Features

### Storefront

* Product catalog
* Product search
* Category filtering
* Price filtering
* Product sorting
* Infinite product loading
* Product details
* Product variants
* Dynamic product attributes
* Shopping cart
* Favorites
* Customer account
* Orders
* Responsive interface
* Multilingual interface
* Multiple currencies

### Catalog

Catalog filters are synchronized with URL search parameters.

Supported filters:

* Search
* Category
* Minimum price
* Maximum price
* Sorting

The catalog uses TanStack Query for server-state management and caching.

### Dynamic Product System

Products are built around a flexible product type architecture instead of a fixed set of hardcoded fields.

```text
Product Type
      ↓
Product Attributes
      ↓
Product Type Attributes
      ↓
Attribute Options
      ↓
Product Variants
```

This allows different types of products to have different attributes, options and variants.

### Admin Panel

The administrative panel includes management for:

* Dashboard
* Categories
* Products
* Product Types
* Product Attributes
* Attribute Options
* Product Variants
* Prices
* Translations
* Orders

Administrative routes are protected by authentication and role-based authorization.

## Authentication & Security

The backend uses:

* JWT authentication
* HTTP-only cookies
* Role-based access control
* Protected routes
* Zod validation
* CORS configuration
* Centralized error handling
* Password hashing with bcrypt

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* TanStack Query
* Zustand
* React Hook Form
* Zod
* i18next
* react-i18next
* SCSS
* Lucide React

### Backend

* Node.js
* Express 5
* TypeScript
* Prisma 6
* PostgreSQL
* JWT
* bcryptjs
* Zod
* cookie-parser
* CORS

### Infrastructure

* Docker
* PostgreSQL
* Vercel
* Render

## Architecture

The project is divided into separate frontend and backend applications.

```text
shopflow/
│
├── client/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── entities/
│       ├── features/
│       ├── i18n/
│       ├── pages/
│       ├── shared/
│       ├── styles/
│       └── types/
│
├── server/
│   └── src/
│       ├── config/
│       ├── errors/
│       ├── lib/
│       ├── middleware/
│       ├── modules/
│       ├── routes/
│       └── types/
│
└── docker-compose.yml
```

### Frontend Architecture

The frontend follows a modular architecture inspired by Feature-Sliced Design.

Main layers:

* `app` — application configuration and routing
* `pages` — page-level compositions
* `features` — user interactions and business features
* `entities` — domain entities and their logic
* `components` — reusable UI components
* `shared` — reusable infrastructure and utilities
* `i18n` — localization
* `types` — shared TypeScript types

### Backend Architecture

The backend is organized into infrastructure, modules and API layers.

Main areas:

* `config` — application configuration
* `middleware` — authentication, authorization and request middleware
* `errors` — centralized error handling
* `lib` — shared infrastructure
* `modules` — domain logic
* `routes` — API routes
* `types` — shared backend types

## Internationalization

The application uses:

* i18next
* react-i18next
* locale-aware API requests

User-facing text is handled through translation keys instead of hardcoded interface strings.

Product and category content can also be localized.

## Currency Support

The application supports multiple currencies:

* RUB
* EUR
* USD
* AMD

## Local Development

### Requirements

* Node.js 20+
* npm
* Docker

### Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY
cd shopflow
```

### Start PostgreSQL

```bash
docker compose up -d
```

PostgreSQL is available locally on:

```text
localhost:5434
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

```bash
cd ../server
npm install
```

### Environment Variables

Create the required environment files for the frontend and backend.

Do not commit secrets or production credentials to the repository.

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

## Production Architecture

```text
┌─────────────────────┐
│      React App      │
│      Vite/TS        │
└──────────┬──────────┘
           │
           ▼
       Vercel
           │
           ▼
┌─────────────────────┐
│    Express API      │
│      Node.js        │
└──────────┬──────────┘
           │
           ▼
        Render
           │
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│      Prisma         │
└─────────────────────┘
```

## Build

### Frontend

```bash
cd client
npm run build
```

### Backend

```bash
cd server
npm run build
```

## Code Quality

The project uses:

* TypeScript strict checking
* ESLint
* Typed API requests
* Zod schema validation
* Modular architecture
* Centralized error handling
* React Query for server-state management

## Project Goals

ShopFlow was built to practice and demonstrate:

* Full-stack application development
* Scalable React architecture
* REST API development
* Relational database design
* Prisma ORM
* Authentication and authorization
* Dynamic product modeling
* Server-state management
* Internationalization
* Production deployment
* E-commerce application architecture

## Future Improvements

* Stripe payment integration
* Extended checkout functionality
* Automated testing
* Additional admin functionality
* Further performance optimization

## License

This project was created as a portfolio project.
