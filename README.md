# 🧭 Futurpfad Admin Panel

A secured, premium, high-contrast warm light B2B publishing terminal built on **Vite**, **React 19**, and **Tailwind CSS**. It connects to a **Cloudflare D1 SQL database** and **Cloudinary** for edge-optimized content delivery.

---

## 🛠️ Local Development

### 1. Prerequisites
Ensure you are logged in to Cloudflare on your machine:
```bash
npx wrangler whoami
```
If not logged in, run:
```bash
npx wrangler login
```

### 2. Local Setup & Secrets
Create a `.dev.vars` file in the `admin-panel/` directory to store local secrets:
```env
ADMIN_PASSWORD=your_local_unlock_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 3. Run Dev Servers
Run the backend API pages server (runs on port `8788` and connects to D1):
```bash
npx wrangler pages dev dist
```

In a separate terminal, start the Vite frontend dev server (runs on port `3000` and proxies `/api` to Wrangler):
```bash
npm run dev
```

---

## 🚀 Production Deployment to Cloudflare Pages

To host this repository as a production-grade application on Cloudflare Pages:

### Step 1: Create the Project
1. Go to the **Cloudflare Dashboard** -> **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
2. Link the repository: `Melbin444/Futurpfadadmin`.

### Step 2: Build Configurations
Apply these settings during setup:
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Root Directory:** *(Leave blank)*

### Step 3: Bind the D1 SQL Database
1. Go to the Pages project dashboard -> **Settings** -> **Functions**.
2. Scroll to **D1 Database Bindings** -> **Add binding**.
3. Set the details:
   - **Variable name (Binding):** `DB` *(Must be uppercase `DB`)*
   - **D1 Database:** Select your database `DB` (ID: `6b180f17-a40d-4c41-acb4-b87d93f9178c`).
4. Apply the binding to **both** **Production** and **Preview** environments.

### Step 4: Configure Production Secrets
Go to **Settings** -> **Environment variables** -> add these variables under **Production** and **Preview** environments:

| Variable Name | Value Type | Description |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | **Secret string** | Password used to authenticate/unlock the console. |
| `CLOUDINARY_CLOUD_NAME` | String | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | String | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | **Secret string** | Cloudinary private API secret key. |

---

## 📁 Project Architecture

This application implements a decoupled **Component-Model** structure:

```text
admin-panel/
├── functions/api/          # Cloudflare Pages Serverless API endpoints
│   ├── auth.ts             # SHA-256 session cookied authentication handler
│   ├── upload.ts           # Secure image signing and Cloudinary upload dispatcher
│   └── ...                 # Leads, blogs, testimonials, faqs, and stats
└── src/
    ├── engines/
    │   ├── types.ts        # Shared TypeScript schemas & interfaces
    │   └── useAdminEngine  # Main state machine, handling all side-effects and API sync
    ├── components/         # Modular presentational views
    │   ├── Layout.tsx      # Sidebar, headers and structure
    │   ├── LoginView.tsx   # Secured console gates
    │   └── ...             # DashboardView, LeadsView, BlogsView, TestimonialsView, FaqsView
    └── App.tsx             # Entry bootstrapper and route guard
```
