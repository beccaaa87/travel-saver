# Travel Saver - Vercel Deployment Guide

Your complete working web app! Save travel destinations from Instagram/TikTok screenshots.

## 🚀 Deploy to Vercel in 10 Minutes

### Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "API Keys" in the sidebar
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-api03-...`)
6. **Keep this safe!**

### Step 2: Deploy to Vercel

**Option A: Using Vercel Web Interface (Easiest)**

1. Go to https://vercel.com
2. Log in to your account
3. Click "Add New..." → "Project"
4. Click "Import Git Repository" → "Import Third-Party Git Repository"
5. Or just drag and drop the entire `travel-saver-vercel` folder!

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI (one time only)
npm install -g vercel

# Navigate to your project folder
cd travel-saver-vercel

# Deploy!
vercel
```

### Step 3: Add Your API Key to Vercel

**IMPORTANT:** After deployment, you need to add your API key as an environment variable.

1. Go to your project on Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Add a new variable:
   - **Name:** `VITE_ANTHROPIC_API_KEY`
   - **Value:** Your API key (the one you copied)
   - **Environment:** All (Production, Preview, Development)
5. Click "Save"
6. Go back to "Deployments" and click "Redeploy" on the latest deployment

### Step 4: Test It!

1. Visit your Vercel URL (something like `travel-saver-abc123.vercel.app`)
2. Upload a screenshot from Instagram/TikTok
3. Watch the AI extract the place info!
4. Save it and see it in your saved places

## ✅ What's Working

- ✅ Screenshot upload (drag & drop or click)
- ✅ AI vision extracts place name, city, country, description, category
- ✅ Beautiful preview before saving
- ✅ Saves to browser (persists between visits)
- ✅ Shows all saved places in a grid
- ✅ Delete places
- ✅ Fully mobile responsive
- ✅ Works on any device

## 💰 Cost

- Anthropic API: ~$0.01-0.03 per screenshot analyzed
- 100 screenshots = $1-3 total
- Vercel hosting: **FREE** (up to 100GB bandwidth/month)

## 📱 Using It

### On Your Phone
1. Open Instagram/TikTok
2. Screenshot a post with a location
3. Go to your Vercel URL
4. Upload the screenshot
5. Save it!

### Share With Friends
Just send them your Vercel URL! They can save places too (each person's saves are stored locally on their device).

## 🔗 Custom Domain

Want to use your own domain? Like `app.yoursite.com`?

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your domain
4. Follow Vercel's instructions to update your DNS

## 🛠 Local Development (Optional)

If you want to test locally before deploying:

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your API key
# VITE_ANTHROPIC_API_KEY=your_key_here

# Start dev server
npm run dev

# Open http://localhost:5173 in your browser
```

## 📊 Next Steps

Once this is working, we can add:

### Phase 2: Organization
- Folders by destination (Ho Chi Minh City, Bangkok, etc.)
- Tags and categories
- Search and filter

### Phase 3: Maps
- Map view with pins
- Route planning
- Distance calculations

### Phase 4: AI Itinerary
- Generate day-by-day itineraries
- Optimize routes
- Time estimates
- Travel tips

### Phase 5: iOS App
- Convert to React Native
- Submit to App Store
- Native mobile experience

## 🐛 Troubleshooting

**"Failed to process image"**
- Make sure you added the API key as an environment variable in Vercel
- Make sure you redeployed after adding the key

**Screenshot upload not working**
- Make sure the image is clear and has visible location/place info
- Try a different screenshot with better text/location tags

**Saved places disappeared**
- Places are stored in your browser's localStorage
- Clearing browser data will delete them
- Phase 2 will add cloud storage so this doesn't happen

## 📞 Need Help?

If something's not working, check:
1. Is the API key added correctly in Vercel?
2. Did you redeploy after adding the key?
3. Does the screenshot have clear location info?

## 🎉 You Did It!

You have a working travel app deployed to the internet! Share your URL and start saving places!

**Your app is live at:** [Your Vercel URL here after deployment]

---

Built with ❤️ by Claude & Becca
