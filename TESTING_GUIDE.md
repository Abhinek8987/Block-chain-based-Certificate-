# Certificate Verification System - Testing Guide

## 🚀 Quick Start

### 1. Start the System
```bash
# Start MongoDB (if not running)
docker run -d -p 27017:27017 --name mongodb-cert mongo:latest

# Start Backend (Terminal 1)
cd backend
npm run dev

# Start Frontend (Terminal 2) 
cd frontend
npm start
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 Demo Accounts

### Institution Account
- **Email**: `institution@demo.com`
- **Password**: `password123`
- **Features**: Upload certificates, generate multilingual certificates, auto-certificate generator

### Student Accounts
- **Student 1**: `student1@demo.com` / `password123`
- **Student 2**: `student2@demo.com` / `password123`  
- **Student 3**: `student3@demo.com` / `password123`
- **Features**: View certificates, download PDFs, verify certificates

### Admin Account
- **Email**: `admin@demo.com`
- **Password**: `password123`
- **Features**: Manage all certificates, verify certificates, system administration

### Verifier Account
- **Email**: `verifier@demo.com`
- **Password**: `password123`
- **Features**: Verify certificates, view verification logs

## 📋 Test Scenarios

### 1. Institution Dashboard Test
1. Login as `institution@demo.com`
2. Should see 5 certificates including:
   - Regular certificates
   - Multilingual certificate (Hindi)
   - Auto-generated certificate
3. Check stats: 5 total certificates, 3 students, 4 verified

### 2. Student Dashboard Test
1. Login as `student1@demo.com`
2. Should see 2 certificates:
   - Web Development Fundamentals
   - कंप्यूटर साइंस बेसिक्स (Hindi certificate)
3. Test download and view functions

### 3. Multilingual Certificate Generation
1. Login as institution
2. Go to "Multilingual Generator"
3. Test generating certificates in different languages:
   - Hindi, Tamil, Telugu, Malayalam, etc.
4. Verify certificates appear in institution dashboard

### 4. Auto-Certificate Generator (Teacher-Friendly)
1. Login as institution
2. Go to "Teacher Certificate Generator"
3. Generate certificates without file uploads
4. Test different templates and languages
5. Verify certificates appear in dashboards

### 5. Certificate Verification
1. Get any certificate ID from dashboard
2. Use QR scanner or direct verification
3. Test with different user roles

## 🔧 Current Features Implemented

### ✅ Completed Features
- [x] Multi-role authentication (Admin, Institution, Student, Verifier)
- [x] Certificate upload and storage
- [x] Blockchain integration (Solidity contracts)
- [x] IPFS integration for file storage
- [x] QR code generation and scanning
- [x] Certificate verification system
- [x] **Multilingual certificate generation** (11+ Indian languages)
- [x] **Teacher-friendly auto-certificate generator** (no uploads required)
- [x] Role-based dashboards
- [x] Certificate download functionality
- [x] Verification logging and analytics
- [x] Responsive UI with Tailwind CSS

### 🎯 Key Highlights
1. **Multilingual Support**: Generate certificates in Hindi, Tamil, Telugu, Malayalam, Kannada, Marathi, Gujarati, Bengali, Punjabi, Urdu
2. **Auto-Certificate Generator**: Teachers can create certificates without uploading files - just fill forms
3. **Multiple Templates**: Classic, Modern, Elegant, Academic, Corporate designs
4. **Complete Integration**: Frontend ↔ Backend ↔ Blockchain ↔ IPFS

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/auth/health

# Restart backend if needed
cd backend
npm run dev
```

### Frontend Issues
```bash
# Check if frontend is running
curl http://localhost:3000

# Restart frontend if needed
cd frontend
npm start
```

### Database Issues
```bash
# Reset demo data
cd backend
node scripts/setupDemoData.js
```

## 📊 System Status
- **Users**: 6 demo accounts created
- **Certificates**: 5 demo certificates (including multilingual and auto-generated)
- **Languages**: 11 supported languages
- **Templates**: 5 certificate templates
- **Authentication**: JWT-based with role authorization
- **Storage**: MongoDB + IPFS integration
- **Blockchain**: Hardhat local network ready

## 🎉 Success Indicators
- Institution can see all 5 certificates in dashboard
- Students can see their respective certificates
- Multilingual certificates display properly
- Auto-generated certificates work without file uploads
- All authentication flows work correctly
- Certificate verification functions properly