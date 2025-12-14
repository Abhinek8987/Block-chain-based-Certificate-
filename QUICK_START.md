# 🚀 Quick Start Guide

## ✅ Installation Complete!

All dependencies have been installed successfully. The project is ready to run.

## 🏃‍♂️ How to Run the Project

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
# Double-click start.bat or run:
start.bat
```

**For Mac/Linux:**
```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

**Step 1: Start MongoDB**
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB instance
```

**Step 2: Start Hardhat Network (Terminal 1)**
```bash
cd smart-contracts
npx hardhat node
# Keep this terminal open
```

**Step 3: Deploy Smart Contracts (Terminal 2)**
```bash
cd smart-contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Step 4: Start Backend (Terminal 3)**
```bash
cd backend
npm run dev
```

**Step 5: Start Frontend (Terminal 4)**
```bash
cd frontend
npm start
```

## 🌐 Access URLs

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Institution | institution@demo.com | password123 |
| Student | student@demo.com | password123 |
| Verifier | verifier@demo.com | password123 |

## 🔧 Prerequisites

Make sure you have:
- ✅ Node.js (v16+) - Installed
- ✅ npm - Installed
- ✅ MongoDB or Docker - Required
- ✅ MetaMask browser extension - For Web3 features

## 🎯 First Steps

1. **Start the application** using one of the methods above
2. **Open http://localhost:3000** in your browser
3. **Install MetaMask** if you haven't already
4. **Connect MetaMask** to localhost:8545 (Hardhat network)
5. **Login** with any demo account
6. **Explore** the different dashboards based on your role

## 🔍 Troubleshooting

### MongoDB Issues
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker restart mongodb
```

### Port Issues
```bash
# Check what's running on ports
netstat -an | findstr "3000 5000 8545 27017"

# Kill processes if needed
taskkill /f /im node.exe  # Windows
pkill node                # Mac/Linux
```

### Smart Contract Issues
```bash
# Clean and recompile
cd smart-contracts
npx hardhat clean
npx hardhat compile
```

## 📚 Next Steps

- Read the full documentation in `/docs/`
- Check out the API documentation at `/docs/api-documentation.md`
- Explore the architecture at `/docs/architecture.md`
- Learn about deployment at `/docs/deployment-guide.md`

## 🆘 Need Help?

If you encounter any issues:
1. Check the terminal outputs for error messages
2. Ensure all prerequisites are installed
3. Verify ports 3000, 5000, 8545, and 27017 are available
4. Check the troubleshooting section above

The project is fully functional and ready to use! 🎉