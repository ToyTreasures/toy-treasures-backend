const ImageKit = require("imagekit");
require("dotenv").config();

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = (file, fileName, folder) => {
  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: file.buffer,
        fileName: fileName,
        folder: folder,
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
};

module.exports = uploadToImageKit;
