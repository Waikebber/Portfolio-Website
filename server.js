const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Import configuration
let config;
if (fs.existsSync('config.local.js')) {
    config = require('./config.local.js');
} else {
    config = require('./config.js');
}

module.exports = config;

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: config.mySQLUser,
    password: config.mySQLPassword,
    database: config.databaseName
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.fromEmail,
        pass: config.fromEmailPassword
    }
});

// POST route to handle form submission
app.post('/contact', (req, res) => {
    const { fName, lName, email, sub, message } = req.body;

    // Insert data into the database
    const query = 'INSERT INTO contacts (first_name, last_name, email, subject, message) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [fName, lName, email, sub, message], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Server error');
            return;
        }

        // Send confirmation email
        const mailOptions = {
            from: config.fromEmail,
            to: config.myEmail,
            subject: `New Contact Form Submission from ${fName} ${lName}`,
            text: `You have received a new message from ${fName} ${lName}.\n\nEmail: ${email}\n\nSubject: ${sub}\n\nMessage:\n${message}`,
            cc: email
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
                res.status(500).send('Server error');
                return;
            }
            res.send('Message sent successfully!');
        });
    });
});

// Endpoint to fetch images and locations from the Excel file
app.get('/images', (req, res) => {
    try {
        // Read the Excel file
        const workbook = xlsx.readFile(path.join(__dirname, 'public/images/photography/images.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = xlsx.utils.sheet_to_json(worksheet);

        // Process the raw data to extract image names and locations
        const data = rawData.reduce((acc, row) => {
            Object.keys(row).forEach((key, index) => {
                if (index % 2 === 0) {
                    const imgName = row[key];
                    const location = row[Object.keys(row)[index + 1]];
                    acc.push({ img_name: imgName, location });
                }
            });
            return acc;
        }, []);

        // Get the list of image files in the directory
        const imagesDir = path.join(__dirname, 'public/images/photography');
        fs.readdir(imagesDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory' });
            }
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

            // Combine image files with their locations
            const imagesWithLocations = imageFiles.map(file => {
                const imageData = data.find(item => item.img_name.toLowerCase() === file.toLowerCase());
                return {
                    src: `/images/photography/${file}`,
                    location: imageData ? imageData.location : 'Unknown Location'
                };
            });

            res.json(imagesWithLocations);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error reading Excel file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
