import multer from "multer";

const profileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/'); // Specify the directory where you want to store uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name as the stored file name
    }
  });
  
  export const uploadPictureMulter = multer({ storage: profileImageStorage });


  const formPhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/'); // Specify the directory where you want to store uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name as the stored file name
    }
  })

  export const reportPictureMulter= multer({ storage: profileImageStorage });