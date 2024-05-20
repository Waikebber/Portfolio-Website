const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Endpoint to fetch images and locations from the Excel file
app.get('/images', (req, res) => {
    try {
        // Read the Excel file
        const workbook = xlsx.readFile(path.join(__dirname, 'public/images/photography/images.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Get the list of image files in the directory
        const imagesDir = path.join(__dirname, 'public/images/photography');
        fs.readdir(imagesDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to scan directory' });
            }
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            
            // Combine image files with their locations
            const imagesWithLocations = imageFiles.map(file => {
                const imageData = data.find(item => item.img_name === file);
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
