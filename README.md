# Stick N Lit

A static, deployment-ready storefront for Stick N Lit handcrafted sticker lighters.

## Product Offer

- Single Lighter — ₹199, shipping charges extra
- Twin Pack — ₹359, shipping charges extra
- Trio Pack — ₹549, free shipping
- 5 Pack — ₹849, free shipping

Every order includes premium packaging, a complimentary Stick N Lit sticker, and individual quality checks. Orders are prepaid only and dispatched within 24–48 hours.

## Run locally

Open `index.html` directly in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Free deployment

Good no-cost options for this static site:

- GitHub Pages: push these files to a GitHub repo, then enable Pages from the repository settings.
- Firebase Hosting Spark plan: deploy static files with Firebase CLI. Firebase's pricing page lists no-cost Hosting storage and transfer quotas.
- Netlify/Vercel free tiers: drag-and-drop or connect a Git repo for static deployment.

## Free storage path

This version stores order drafts and update emails in browser `localStorage`, so it works without a backend. For production orders, use one of these free-start paths:

- Firebase Hosting + Cloud Firestore + Cloud Storage.
- Supabase database + Storage bucket.
- Google Forms or Tally for early manual order intake.

Store only the order data you actually need.
