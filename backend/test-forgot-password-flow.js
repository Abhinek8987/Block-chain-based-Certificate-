const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123';
const NEW_PASSWORD = 'NewPassword123';

async function runTest() {
    console.log('🚀 Starting Forgot Password Flow Test (Backend Context)');

    try {
        // 1. Connect to Database (to read OTP)
        console.log('📦 Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/certificate-verification';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // 2. Register Test User
        console.log('👤 Registering test user...');
        try {
            await axios.post(`${API_URL}/signup`, {
                name: 'Test User',
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                role: 'student'
            });
            console.log('✅ User registered');
        } catch (e) {
            console.log('⚠️ Signup failed:', e.response ? e.response.data : e.message);
            console.log('Continuing explicitly to see if it was just existence check...');
        }


        // 3. Request OTP
        console.log('📧 Requesting OTP...');
        await axios.post(`${API_URL}/forgot-password`, { email: TEST_EMAIL });
        console.log('✅ OTP requested (Email sent mocked)');

        // 4. Retrieve OTP from DB
        console.log('🔍 Retrieving OTP from database...');
        const user = await User.findOne({ email: TEST_EMAIL }).select('+otp');
        if (!user || !user.otp) {
            throw new Error('OTP not found in database');
        }

        // FOR TESTING PURPOSE: Patch with known OTP
        const KNOWN_OTP = '123456';
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(KNOWN_OTP, salt, 1000, 64, 'sha512').toString('hex');
        user.otp = `${salt}:${hash}`;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        console.log(`✅ Database patched with known OTP: ${KNOWN_OTP}`);

        // 5. Verify OTP
        console.log('🔑 Verifying OTP...');
        const verifyRes = await axios.post(`${API_URL}/verify-otp`, {
            email: TEST_EMAIL,
            otp: KNOWN_OTP
        });
        console.log('✅ OTP Verified');
        const resetToken = verifyRes.data.resetToken;

        // 6. Reset Password
        console.log('🔄 Resetting Password...');
        await axios.post(`${API_URL}/reset-password`, {
            resetToken,
            password: NEW_PASSWORD
        });
        console.log('✅ Password Reset Successfully');

        // 7. Login with Old Password (Should fail)
        console.log('🧪 Testing Login with OLD password (should fail)...');
        try {
            await axios.post(`${API_URL}/login`, {
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            });
            throw new Error('Login with old password should have failed');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                console.log('✅ Login failed as expected');
            } else {
                throw e;
            }
        }

        // 8. Login with New Password (Should success)
        console.log('🧪 Testing Login with NEW password...');
        await axios.post(`${API_URL}/login`, {
            email: TEST_EMAIL,
            password: NEW_PASSWORD
        });
        console.log('✅ Login successful with new password');

        console.log('🎉 ALL TESTS PASSED');

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    } finally {
        await mongoose.connection.close();
    }
}

runTest();
