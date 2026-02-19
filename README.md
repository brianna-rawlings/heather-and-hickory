# heather & hickory.

Golf apparel & accessories e-commerce store built with Next.js and Square.

🌐 [heatherandhickory.com](https://heatherandhickory.com)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Payments:** Square Web Payments SDK
- **Product Catalog:** Square Catalog API
- **Deployment:** Vercel

## Features

- Product catalog fetched from Square Dashboard
- Size selection per product
- Shopping cart with slide-out drawer
- Secure checkout via Square (server-side price verification)
- Product detail pages
- Category pages (Polos & T-Shirts, Hoodies & Zips, Hats & Accessories)
- Shipping & Returns policy pages
- Fully responsive — mobile & desktop
- Deployed automatically via GitHub → Vercel

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/my-golf-store.git
cd my-golf-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```
NEXT_PUBLIC_SQUARE_APP_ID=your_square_app_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_API_URL=https://connect.squareup.com
```

> For sandbox/testing use `https://connect.squareupsandbox.com` as the API URL.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/
│   ├── catalog/        # Fetches products from Square Catalog API
│   └── square/         # Processes payments via Square (server-side)
├── checkout/           # Checkout page with Square payment form
├── returns/            # Returns & exchanges policy
├── shipping/           # Shipping policy
├── shop/
│   ├── [category]/     # Dynamic category pages
│   └── product/[id]/   # Individual product detail pages
├── story/              # Our Heritage page
├── layout.tsx
└── page.tsx            # Homepage

components/
├── CartDrawer.tsx       # Slide-out shopping cart
├── Footer.tsx
├── Navbar.tsx
├── ProductCard.tsx
└── ProductCarousel.tsx  # Desktop carousel

context/
└── CartContext.tsx      # Global cart state

data/
└── products.ts          # Fallback mock products (used if Square is unavailable)

hooks/
└── useProducts.ts       # Fetches products from /api/catalog
```

## Deployment

This project auto-deploys to Vercel on every push to `main`. Make sure your environment variables are set in your Vercel project settings under **Settings → Environment Variables**.

## Notes

- Products and categories are managed entirely in the [Square Dashboard](https://squareup.com/dashboard)
- Adding a new product in Square will automatically appear on the site (with up to 60 second cache)
- `.env.local` is gitignored — never commit your Square credentials