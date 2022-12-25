const express = require('express');
const qrcode = require('qrcode'); // npm install qrcode
const multer = require('multer'); // npm install multer
const path = require('path');
var ImageKit = require("imagekit");
var fs = require('fs');

const app = express();

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

exports.handler = async (event, context) => {
  try{

// Set up the /generateQRNow route to handle POST requests
app.post('/generateQRNow', upload.single('imageFile'), (req, res) => {
  // Get the image file and video URL from the request body
  const imageFile = req.file;
  const videoUrl = req.body.videoUrl;
  var url = '';

  if(imageFile)
  {
       UploadViaImageKit(imageFile, (result) => {
        if (result) {
          url = result;
          // Generate a QR code from the image file and video URL
          generateQrCode(url, (err, qrCodeImage) => {
            if (err) {
              res.status(500).send('Error generating QR code');
            } else {
              // Return the QR code image as a response
              res.setHeader('Content-Type', 'image/png');
              res.send(qrCodeImage);
            }
          });

        } else {
          res.status(500).send('Error uploading image');
        }
      });
  }
  else {
    url = videoUrl;

    // Generate a QR code from the image file and video URL
    generateQrCode(url, (err, qrCodeImage) => {
      if (err) {
        res.status(500).send('Error generating QR code');
      } else {
        // Return the QR code image as a response
        res.setHeader('Content-Type', 'image/png');
        res.send(qrCodeImage);
      }
    });
  }
});
return {
  statusCode: 200,
  body: JSON.stringify(data)
};
} catch (err) {
return {
  statusCode: 500,
  body: err.toString()
};
}
};

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Function to generate a QR code from the given image file and video URL
function generateQrCode(url, callback) {
  if (url) {
    // Use the URL to generate the QR code
    qrcode.toBuffer(url, { errorCorrectionLevel: 'H' }, (err, buffer) => {
      if (err) {
        callback(err);
      } else {
        callback(null, buffer);
      }
    });
  } else {
    callback(new Error)
  }
}

async function UploadViaImageKit(imageFile, callback) {
  var imagekit = new ImageKit({
    publicKey : "public_J3bmoGVx4SmeYc4MyGllYOt0ofU=",
    privateKey : "private_LpWCJD4XNWMTKM3C3mxzDU4Uu78=",
    urlEndpoint : "https://ik.imagekit.io/sv8vslhxe/"
  });

  var authenticationParameters = imagekit.getAuthenticationParameters();
  console.log(authenticationParameters);

  // Get image base64
  const file = fs.readFileSync(imageFile.path)
  const base64String = Buffer.from(file).toString('base64')

  await imagekit.upload({
      file : base64String,
      fileName : imageFile.filename,
      tags : ["QR"]
  }, function(error, result) {
    if(error) {
      console.log(error);
      callback();
    }
    else {
      console.log(result);
      callback(result.url);
    }
  });
}