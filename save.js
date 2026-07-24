const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Configure static file serving
app.use(express.static(path.join(__dirname, './')));

// Parse form-urlencoded and JSON body
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '200mb' }));

// Multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subPath = req.body.mediaPath ? req.body.mediaPath.replace(/\.{2,}/g, '') : '';
    let uploadDir = path.join(__dirname, 'media', subPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    let cleanName = file.originalname.replace(/[^\/\\a-zA-Z0-9\-\._]/g, '');
    cb(null, cleanName);
  }
});
const upload = multer({ storage });

function sanitizeFileName(file, allowedExtension = 'html') {
    if (!file) return '';
    const basename = path.basename(file);
    const disallow = ['.htaccess', 'passwd'];
    if (disallow.includes(basename)) {
        console.error('Filename not allowed!');
        return '';
    }
    
    file = file.replace(/\?.*$/, '')
               .replace(/\.{2,}/g, '')
               .replace(/[^\/\\a-zA-Z0-9\-\._]/g, '');
    
    if (file) {
        file = path.join(__dirname, file);
    } else {
        return '';
    }
    
    if (allowedExtension) {
        const ext = path.extname(file);
        if (ext) {
            file = file.slice(0, -ext.length);
        }
        file = `${file}.${allowedExtension}`;
    }
    
    return file;
}

// POST /save.php
app.post('/save.php', (req, res) => {
  let { file, action, startTemplateUrl, html } = req.body;
  let result = "Error saving file!";
  
  let targetPath = sanitizeFileName(file);

  if (targetPath && html) {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, html, 'utf8');
      result = "File saved!";
    } catch (err) {
      console.error('Save file error:', err);
      result = "Error saving file: " + err.message;
    }
  }

  res.send(result);
});

// POST /scan.php
app.post('/scan.php', (req, res) => {
  let mediaFolder = path.join(__dirname, 'media');
  if (req.body && req.body.mediaPath) {
    let subPath = req.body.mediaPath.replace(/\.{2,}/g, '');
    mediaFolder = path.join(mediaFolder, subPath);
  }

  function scanDir(dir, baseDir) {
    let files = [];
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      for (const f of items) {
        if (!f || f.startsWith('.')) continue;
        const fullPath = path.join(dir, f);
        const relPath = fullPath.replace(baseDir, '').replace(/\\/g, '/');
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          files.push({
            name: f,
            type: 'folder',
            path: relPath,
            items: scanDir(fullPath, baseDir)
          });
        } else {
          files.push({
            name: f,
            type: 'file',
            path: relPath,
            size: stat.size
          });
        }
      }
    }
    return files;
  }

  const items = scanDir(mediaFolder, mediaFolder);
  res.json({
    name: '',
    type: 'folder',
    path: '',
    items: items
  });
});

// POST /upload.php
app.post('/upload.php', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(500).send('No file uploaded or invalid file');
  }
  let subPath = req.body.mediaPath ? req.body.mediaPath.replace(/\.{2,}/g, '') : '';
  if (req.body.onlyFilename) {
    res.send(req.file.filename);
  } else {
    let relativeUrl = path.join('media', subPath, req.file.filename).replace(/\\/g, '/');
    res.send(relativeUrl);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`WebCraft Builder server listening on port ${PORT}`);
});
