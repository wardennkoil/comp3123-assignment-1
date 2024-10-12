const User = require('../models/User');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


exports.signup = [
    body('username').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                username,
                email,
                password: hashedPassword,
            });

            await user.save();

            res.status(201).json({
                message: 'User created successfully.',
                user_id: user._id,
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
];


exports.login = [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid Username and password',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid Username and password',
                });
            }


            res.status(200).json({
                message: 'Login successful.',
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
];
