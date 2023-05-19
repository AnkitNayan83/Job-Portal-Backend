import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext == ".pdf") callback(null, true);
    else {
      console.log("only pdf format is allowed");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
