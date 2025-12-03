# Nexsoul Astro 🔮

> **Spiritual intelligence app for Nexsoul® that calculates Vedic Moon Rashi and recommends personalized crystal bracelets using Gemini AI.**

This application uses the precise astronomical position of the moon at the moment of your birth (Vedic Sidereal Astrology) to determine your "Rashi" (Moon Sign). Based on this cosmic blueprint, it recommends specific Nexsoul® healing crystals to balance your energy.

## 🚀 How to go Live (Free)

This app is built with React and Vite. The best way to host it is **Vercel**.

1.  **Push to GitHub:** Ensure this code is in your GitHub repository.
2.  **Go to Vercel:** Log in to [vercel.com](https://vercel.com) using your GitHub account.
3.  **New Project:** Click "Add New Project" and import this repository.
4.  **Environment Variables:**
    *   Vercel will ask for Environment Variables. You must add one:
    *   **Name:** `API_KEY`
    *   **Value:** `AIza......` (Your Google Gemini API Key)
5.  **Deploy:** Click Deploy. Vercel will give you a URL (e.g., `https://nexsoul-astro.vercel.app`).

## 🔗 Adding to your Website

Once you have your Vercel URL, you can add a button to your main website to direct customers here.

**Copy and paste this code:**

```html
<a href="https://YOUR-VERCEL-LINK.app" target="_blank" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-family: sans-serif; font-weight: bold;">
  ✨ Get Free Crystal Recommendation
</a>
```