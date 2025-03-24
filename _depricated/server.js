const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const app = express();
const PORT = process.env.PORT || 3000;

// Force HTTPS redirect
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Endpoint to fetch images and locations from the Excel file
app.get('/images', (req, res) => {
    try {
        const workbook = xlsx.readFile(path.join(__dirname, 'public/images/photography/images.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = xlsx.utils.sheet_to_json(worksheet);

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

        const imagesDir = path.join(__dirname, 'public/images/photography');
        fs.readdir(imagesDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory' });
            }
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

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
