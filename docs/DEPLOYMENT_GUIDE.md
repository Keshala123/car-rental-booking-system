# Deployment Guide - Car Rental Booking System

This guide will walk you through deploying your application to production.

## 🎯 Deployment Strategy

- **Frontend**: Vercel or Netlify (recommended: Vercel for React)
- **Backend**: Render or Railway (recommended: Render for Node.js)
- **Database**: MongoDB Atlas (already configured ✅)

---

## 📦 Pre-Deployment Checklist

### ✅ Backend Preparation

1. **Environment Variables** - Ensure `.env` file exists in `server/` folder:
```env
MONGODB_URI=mongodb+srv://admin:Admin%40123@car-rental-cluster.osdh0ta.mongodb.net/car_rental_db
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

2. **Update CORS Configuration** in `server/server.js`:
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};
```

3. **Add Production Scripts** in `server/package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js"
}
```

### ✅ Frontend Preparation

1. **Create Environment File** - Create `client/.env`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

2. **Update API Configuration** in `client/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 🚀 Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `car-rental-booking-system` repository

### Step 3: Configure Service
```
Name: car-rental-backend
Region: Singapore (closest to MongoDB Atlas)
Branch: main (or master)
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:
```
MONGODB_URI = mongodb+srv://admin:Admin%40123@car-rental-cluster.osdh0ta.mongodb.net/car_rental_db
PORT = 5000
NODE_ENV = production
CLIENT_URL = https://your-frontend-url.vercel.app
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy the deployed URL: `https://car-rental-backend.onrender.com`

### Step 6: Test API
```powershell
curl https://car-rental-backend.onrender.com/api/cars
```

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import `car-rental-booking-system` repository
3. Click "Import"

### Step 3: Configure Project
```
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Add Environment Variables
In Vercel project settings → Environment Variables:
```
VITE_API_URL = https://car-rental-backend.onrender.com/api
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Copy the deployed URL: `https://car-rental-booking-system.vercel.app`

### Step 6: Update Backend CORS
Go back to Render, update `CLIENT_URL` environment variable:
```
CLIENT_URL = https://car-rental-booking-system.vercel.app
```
Redeploy backend service.

---

## 🚀 Alternative: Railway Deployment (Backend)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: New Project
1. Click "New Project" → "Deploy from GitHub repo"
2. Select `car-rental-booking-system`

### Step 3: Configure
1. Select `server` folder as root
2. Add environment variables (same as Render)
3. Deploy

### Railway will auto-detect Node.js and deploy

---

## 🚀 Alternative: Netlify Deployment (Frontend)

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub

### Step 2: New Site
1. Click "Add new site" → "Import an existing project"
2. Connect GitHub → Select repository

### Step 3: Configure
```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

### Step 4: Environment Variables
Add in Netlify dashboard:
```
VITE_API_URL = https://your-backend-url.onrender.com/api
```

### Step 5: Deploy
Click "Deploy site"

---

## ✅ Post-Deployment Verification

### Test All Features:
1. ✅ Home page loads with images
2. ✅ Fleet page displays all cars
3. ✅ Booking form submits successfully
4. ✅ Contact form works
5. ✅ Gallery images load
6. ✅ Navigation works across all pages
7. ✅ Responsive design on mobile

### Check API Endpoints:
```powershell
# Get all cars
curl https://your-backend-url.onrender.com/api/cars

# Create booking (test)
curl -X POST https://your-backend-url.onrender.com/api/bookings `
  -H "Content-Type: application/json" `
  -d '{"car":"CAR_ID","customerName":"Test User","email":"test@example.com","phone":"1234567890","pickupDate":"2025-12-25","returnDate":"2025-12-30","pickupLocation":"Airport","dropoffLocation":"Airport"}'

# Contact form
curl -X POST https://your-backend-url.onrender.com/api/contact `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Testing"}'
```

---

## 📝 Update README with Live Links

After deployment, update `README.md`:

```markdown
## 🌐 Live Demo

**Frontend**: https://car-rental-booking-system.vercel.app  
**Backend API**: https://car-rental-backend.onrender.com  
**Database**: MongoDB Atlas (Singapore Region)
```

---

## 🔧 Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure `CLIENT_URL` in backend `.env` matches frontend URL exactly (no trailing slash)

### Issue: API Requests Fail
**Solution**: Check `VITE_API_URL` in frontend has `/api` at the end

### Issue: Database Connection Failed
**Solution**: Verify MongoDB Atlas IP whitelist allows all IPs (0.0.0.0/0)

### Issue: Images Not Loading
**Solution**: Check browser console for CORS issues, ensure Pexels URLs are accessible

### Issue: 404 on Page Refresh
**Solution**: Add `vercel.json` in `client/` folder:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🎉 Deployment Complete!

Once deployed:
1. ✅ Test all features on live site
2. ✅ Take screenshots of deployed version
3. ✅ Update README with live URLs
4. ✅ Add deployment URLs to documentation
5. ✅ Submit project with live links

---

## 📞 Support

If you encounter issues:
- Check Render/Vercel deployment logs
- Review environment variables
- Test API endpoints with curl
- Check browser console for frontend errors

Good luck with your deployment! 🚀
