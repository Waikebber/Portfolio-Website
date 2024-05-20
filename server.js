const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to fetch images and locations from the Excel file
app.get('/images', (req, res) => {
    const workbook = xlsx.readFile(path.join(__dirname, 'images.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
