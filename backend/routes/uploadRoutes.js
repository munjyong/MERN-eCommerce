import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// From multer docs
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file tpye to ensure only images are uploaded
function checkFileType(file, cb) {
  // Regex for all the file extensions allowed
  const fileTypes = /jpg|jpeg|png/;
  // Returns true or false if the file extension matches the extentions we allowed in fileTypes
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Upload images only");
  }
}

// Middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Send the file path for the image
router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
