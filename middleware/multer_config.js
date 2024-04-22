const multer = require('multer');
const path = require('path');

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = 'public/images'; // Specify the directory where images will be stored
    console.log('Destination path:', destinationPath);
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log('Generated filename:', fileName);
    cb(null, fileName);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
