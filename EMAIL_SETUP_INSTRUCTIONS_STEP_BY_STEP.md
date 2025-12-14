# 📧 EMAIL SETUP - STEP BY STEP GUIDE

## 🚨 **CURRENT ISSUE**
Students are not receiving email notifications because the email credentials are not configured.

## 🔧 **STEP-BY-STEP SETUP**

### **STEP 1: Gmail Account Setup**

#### **1.1 Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Find "2-Step Verification" and click on it
4. Follow the steps to enable 2FA (you'll need your phone)
5. ✅ **Verify 2FA is enabled** before proceeding

#### **1.2 Generate App Password**
1. Still in "Security" section, scroll down to find "App passwords"
2. Click on "App passwords"
3. You might need to sign in again
4. Select "Mail" from the dropdown
5. Click "Generate"
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
7. ⚠️ **IMPORTANT:** This password is shown only once - copy it immediately!

### **STEP 2: Update Environment Variables**

#### **2.1 Edit backend/.env file**
Open `backend/.env` and replace these lines:

**BEFORE:**
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
```

**AFTER:**
```env
EMAIL_USER=youractual@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

#### **2.2 Example Configuration**
```env
# Email Configuration (FREE Gmail SMTP)
EMAIL_USER=john.doe@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM_NAME=ABC University Certificate System
```

### **STEP 3: Restart Backend Server**

#### **3.1 Stop Current Server**
- Press `Ctrl+C` in your backend terminal

#### **3.2 Start Server Again**
```bash
cd backend
npm start
# OR
node server.js
```

### **STEP 4: Test Email Configuration**

#### **4.1 Run Diagnostic Script**
```bash
cd backend
node scripts/diagnoseEmailIssue.js
```

#### **4.2 Expected Output**
```
✅ EMAIL_USER is configured
✅ EMAIL_APP_PASSWORD is configured
✅ Email configuration is valid
✅ Test email sent successfully!
```

### **STEP 5: Test Certificate Generation**

#### **5.1 Generate a Test Certificate**
1. Go to your frontend application
2. Login as an institution
3. Generate a certificate with a **valid email address**
4. Check if the email is received

#### **5.2 Check Server Logs**
Look for these messages in your backend console:
```
📧 Sending certificate notification to: student@example.com
✅ Certificate email sent successfully!
📧 Message ID: <some-message-id>
```

## 🔍 **TROUBLESHOOTING**

### **Issue 1: "Invalid login" Error**
```
❌ Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions:**
- ✅ Verify 2FA is enabled on your Gmail account
- ✅ Use App Password, NOT your regular Gmail password
- ✅ Ensure EMAIL_USER is your complete Gmail address
- ✅ Check for typos in the App Password (remove spaces)

### **Issue 2: "Connection refused" Error**
```
❌ Error: connect ECONNREFUSED
```

**Solutions:**
- ✅ Check your internet connection
- ✅ Verify firewall allows SMTP traffic (port 587)
- ✅ Try using port 465 with secure: true

### **Issue 3: Email Not Received**
**Check:**
- ✅ Spam/Junk folder
- ✅ Student email address is correct
- ✅ Gmail sending limits (500 emails/day for free accounts)

### **Issue 4: Environment Variables Not Loading**
**Solutions:**
- ✅ Restart backend server after changing .env
- ✅ Check .env file is in backend/ directory
- ✅ Verify no extra spaces in .env file

## 📧 **QUICK TEST SCRIPT**

Create a test file `backend/scripts/quickEmailTest.js`:

```javascript
require('dotenv').config();
const emailService = require('../utils/emailService');

async function quickTest() {
  const testData = {
    studentEmail: 'YOUR_EMAIL@gmail.com', // Replace with your email
    studentName: 'Test Student',
    courseName: 'Test Course',
    certificateType: 'Test Certificate',
    institutionName: 'Test Institution',
    issueDate: new Date(),
    certificateId: 'TEST123',
    verificationUrl: 'http://localhost:3000/certificate/TEST123',
    language: 'english'
  };
  
  const result = await emailService.sendCertificateNotification(testData);
  console.log('Result:', result);
}

quickTest();
```

Run with: `node scripts/quickEmailTest.js`

## ✅ **SUCCESS CHECKLIST**

- [ ] 2FA enabled on Gmail account
- [ ] App Password generated and copied
- [ ] EMAIL_USER updated in .env file
- [ ] EMAIL_APP_PASSWORD updated in .env file
- [ ] Backend server restarted
- [ ] Diagnostic script shows ✅ for all checks
- [ ] Test email received successfully
- [ ] Certificate generation sends emails to students

## 🎯 **FINAL VERIFICATION**

Once setup is complete:

1. **Generate a certificate** for a student
2. **Check the backend console** for email logs
3. **Verify the student receives** the email
4. **Check email content** includes certificate details and verification link

**🎉 Once you see "✅ Certificate email sent successfully!" in your backend logs, the email system is working!**