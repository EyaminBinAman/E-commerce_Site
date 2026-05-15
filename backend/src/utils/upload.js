const fs = require("fs");
const path = require("path");
const multer = require("multer");

const ensureUploadDirectory = (folderName) => {
  const uploadPath = path.join(process.cwd(), "uploads", folderName);
  fs.mkdirSync(uploadPath, { recursive: true });
  return uploadPath;
};

const createImageUpload = ({ folder = "common", maxSizeKB = 500 } = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const uploadPath = ensureUploadDirectory(folder);
        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const baseName = path
        .basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

      cb(null, `${baseName}-${Date.now()}${extension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeKB * 1024,
    },
  });
};

module.exports = {
  createImageUpload,
};
