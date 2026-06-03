const fs = require("fs");
const path = require("path");

const photosDir = path.join(__dirname, "photos");

const files = fs.readdirSync(photosDir)
    .filter(file => /\.(jpg|jpeg|png|webp|bmp)$/i.test(file));

const data = "const galleryImages = " + JSON.stringify(
    files.map(file => ({
        src: "photos/" + file,
        title: path.parse(file).name
    })),
    null,
    2
) + ";";

fs.writeFileSync(path.join(__dirname, "gallery-data.js"), data, "utf8");

console.log(`Hotovo: ${files.length} fotiek`);