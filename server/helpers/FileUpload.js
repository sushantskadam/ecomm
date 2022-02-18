//for img upload
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        path.join(
          __dirname, '../uploads'
        )
      );
      // console.log(path.join(__dirname, '../../.././uploads/'))
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
        // "logo"
      );
      //console.log(file)
    },
  });
//   const multi_upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
//     fileFilter: (req, file, cb) => {
//       console.log(file.mimetype);
//       if (
//         file.mimetype == "image/png" ||
//         file.mimetype == "image/jpg" ||
//         file.mimetype == "image/jpeg"
//       ) {
//         cb(null, true);
//       } else {
//         cb(null, false);
//         const err = new Error("Only .png, .jpg and .jpeg format allowed!");
//         err.name = "ExtensionError";
//         return cb(err);
//       }
//     },
//   }).array("myfile", 3);

  const upload = multer({ storage: storage });

  module.exports={upload}