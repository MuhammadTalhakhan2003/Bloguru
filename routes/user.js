const { Router } = require('express');
const User = require('../models/user');

const router = Router();

// Render Sign-in Page
router.get('/signin', (req, res) => {
    return res.render('signin');
});

// Render Sign-up Page
router.get('/signup', (req, res) => {
    return res.render('signup');
});

// Handle Sign-in
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login Attempt:', email, password);

        const token = await User.matchPassword(email, password);

        if (!token) {
            return res.render('signin', { error: 'Invalid email or password' });
        }

        return res.cookie('token', token, { httpOnly: true }).redirect('/');
    } catch (error) {
        console.error('Sign-in Error:', error);
        return res.render('signin', { error: 'Something went wrong, please try again.' });
    }
});

// Handle Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

// Handle Sign-up
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'Email already in use' });
        }

        await User.create({ fullName, email, password });
        return res.redirect('/signin'); // Redirect to login after successful signup
    } catch (error) {
        console.error('Sign-up Error:', error);
        return res.render('signup', { error: 'Error creating account, please try again.' });
    }
});

module.exports = router;
