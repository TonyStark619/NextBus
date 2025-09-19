# NextBus Deployment Guide

## 🚀 Quick Deploy to Render

### 1. Prepare Your Repository
- Push your code to GitHub
- Make sure all files are committed

### 2. Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:

**Build Settings:**
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Node Version:** 18.x

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render's default)
- `CLIENT_ORIGIN` = `*` (or your domain)

### 3. Important Fixes for Production

#### Server Configuration
The server is already configured to:
- ✅ Serve static files from `/client` directory
- ✅ Handle CORS for all origins
- ✅ Use environment PORT variable
- ✅ Auto-detect available ports

#### Client Configuration
The client automatically:
- ✅ Uses `window.location.origin` for API calls
- ✅ Falls back to environment variables
- ✅ Works with any domain

### 4. Common Issues & Solutions

#### Issue: Buses not showing on map
**Solution:** 
- Check browser console for WebSocket errors
- Ensure server is running and accessible
- Verify CORS settings

#### Issue: Location search not working
**Solution:**
- Check if geocoding API calls are successful
- Verify server endpoints are responding
- Check network tab in browser dev tools

#### Issue: Map not loading
**Solution:**
- Check if Leaflet CSS/JS is loading
- Verify OpenStreetMap tiles are accessible
- Check for JavaScript errors

### 5. Testing Your Deployment

1. **Health Check:** Visit `https://your-app.onrender.com/health`
2. **API Test:** Visit `https://your-app.onrender.com/stops`
3. **Frontend:** Visit `https://your-app.onrender.com/`

### 6. Environment Variables for Production

```bash
NODE_ENV=production
PORT=10000
CLIENT_ORIGIN=*
```

### 7. Build Process

The app uses:
- **Frontend:** Parcel bundler (auto-configured)
- **Backend:** Express.js server
- **Real-time:** Socket.IO WebSockets

### 8. File Structure for Deployment

```
/
├── server/           # Backend Express server
│   ├── index.js     # Main server file
│   ├── data/        # Static bus data
│   └── sim/         # Bus simulation
├── client/          # Frontend files
│   ├── index.html   # Main page
│   ├── map.html     # Map page
│   ├── chatbot.html # ChatBot page
│   └── styles.css   # Styling
└── package.json     # Root package config
```

### 9. Troubleshooting

#### WebSocket Connection Issues
- Check if Render supports WebSockets (it does)
- Verify Socket.IO is properly configured
- Check browser console for connection errors

#### Static File Serving
- Ensure `express.static` is configured correctly
- Check file paths are relative to server directory
- Verify catch-all route is at the end

#### API Endpoints
- Test each endpoint individually
- Check CORS headers
- Verify request/response formats

### 10. Performance Optimization

- ✅ Static files served efficiently
- ✅ WebSocket connections optimized
- ✅ Minimal external dependencies
- ✅ Responsive design for mobile

### 11. Security Considerations

- ✅ CORS properly configured
- ✅ No sensitive data in client code
- ✅ Input validation on server
- ✅ Rate limiting on external APIs

## 🎯 Success Checklist

- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Frontend loads correctly
- [ ] Map displays with tiles
- [ ] Bus stops appear on map
- [ ] Location search works
- [ ] Route planning functions
- [ ] WebSocket connection established
- [ ] Real-time buses show movement
- [ ] ChatBot is accessible and functional

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check Render service logs
5. Ensure all dependencies are installed

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render will automatically rebuild
3. Test the new deployment
4. Monitor for any issues

---

**Happy Deploying! 🚌✨**
