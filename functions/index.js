const express = require('express');
const qrcode = require('qrcode'); // npm install qrcode

const app = express();

// Set up body-parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up the /generateQRNow route to handle POST requests
app.post('/generateQRNow', (req, res) => {
  // Get the image and video URLs from the request body
  const imageUrl = req.body.imageUrl;
  //const videoUrl = req.body.videoUrl;

  // Generate a QR code from the image and video URLs
  generateQrCode(imageUrl, (err, qrCodeImage) => {
    if (err) {
      res.status(500).send('Error generating QR code');
    } else {
      // Return the QR code image as a response
      res.setHeader('Content-Type', 'image/png');
      res.send(qrCodeImage);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Function to generate a QR code from the given image and video URLs
function generateQrCode(imageUrl, callback) {
  qrcode.toBuffer(imageUrl, { errorCorrectionLevel: 'H' }, (err, buffer) => {
    if (err) {
      callback(err);
    } else {
      callback(null, buffer);
    }
  });
}
