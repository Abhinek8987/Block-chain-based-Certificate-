const PDFDocument = require('./backend/node_modules/pdfkit');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'backend', 'fonts');
const outputDir = path.join(__dirname, 'backend');

console.log("Checking fonts dir:", fontsDir);

if (!fs.existsSync(fontsDir)) {
    console.error("Fonts directory does not exist!");
    process.exit(1);
}

const fonts = [
    'NotoSansDevanagari-Regular.ttf',
    'NotoSansTamil-Regular.ttf'
];

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(path.join(outputDir, 'font_test.pdf')));

fonts.forEach(fontFile => {
    const fontPath = path.join(fontsDir, fontFile);
    console.log(`Testing font: ${fontFile}`);
    console.log(`Path: ${fontPath}`);

    if (fs.existsSync(fontPath)) {
        try {
            const name = fontFile.split('.')[0];
            doc.registerFont(name, fontPath);
            doc.font(name).fontSize(20).text(`Test text for ${name}`);
            console.log(`✅ Successfully verified ${fontFile}`);
        } catch (error) {
            console.error(`❌ Failed to load/use ${fontFile}:`, error.message);
        }
    } else {
        console.error(`❌ File not found: ${fontPath}`);
    }
});

doc.end();
console.log("Done.");
