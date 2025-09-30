# MLS ProAdmin

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cizenel/generated-app-20250930-071443)

MLS ProAdmin is a comprehensive, role-based user and data management platform designed for administrative oversight. It features a secure login system with three distinct user levels: Super Admin, Admin, and Normal User, each with specific permissions. The core of the application is a powerful user management module that allows authorized users to add, edit, delete, filter, sort, and export user data. Additionally, a dedicated 'Definitions' section provides CRUD functionality for managing key business entities such as Sponsors, Centers, Researchers, and Project Codes, again governed by user roles. The entire application is wrapped in a visually stunning, modern, and intuitive interface.

## ✨ Key Features

-   **Role-Based Access Control (RBAC):** Three user levels (Super Admin, Admin, Normal User) with granular permissions.
-   **Secure Authentication:** Password-protected login system.
-   **Comprehensive User Management:** Full CRUD operations for users.
-   **Advanced Data Tables:** Filtering, sorting, and pagination for all data lists.
-   **Data Export:** Export user lists and other data to PDF, Excel, and DOCX formats.
-   **Definitions Management:** Manage core business entities like Sponsors, Centers, Researchers, and Project Codes.
-   **Modern & Responsive UI:** A clean, professional, and fully responsive interface built with the latest web technologies.

## 🛠️ Technology Stack

-   **Frontend:**
    -   React & Vite
    -   TypeScript
    -   Tailwind CSS
    -   shadcn/ui
    -   React Router for routing
    -   TanStack Table for data grids
    -   Framer Motion for animations
    -   Lucide React for icons
-   **State Management:**
    -   Zustand
-   **Backend:**
    -   Hono on Cloudflare Workers
-   **Storage:**
    -   Cloudflare Durable Objects

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd mls_proadmin
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Hono backend running on `workerd`, run the following command:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Linting

To run the linter and check for code quality issues, use:

```bash
bun run lint
```

## 📁 Project Structure

-   `src/`: Contains all the frontend React application code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components, including shadcn/ui elements.
    -   `stores/`: Zustand stores for global state management.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the backend Hono API code, Durable Object definitions, and routing.
-   `shared/`: TypeScript types and mock data shared between the frontend and backend.

## ☁️ Deployment

This application is designed to be deployed to the Cloudflare network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Build and Deploy:**
    Run the deploy script to build the application and deploy it to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Wrangler will handle the process of building the frontend assets, bundling the worker, and deploying everything to Cloudflare Pages.

---

Or deploy directly with the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cizenel/generated-app-20250930-071443)