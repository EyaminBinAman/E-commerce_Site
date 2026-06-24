const fs = require("fs");
const path = require("path");

const deleteImageFile = (imagePath, folderName) => {
  if (!imagePath || typeof imagePath !== "string") {
    return;
  }

  const prefix = `/uploads/${folderName}/`;
  if (!imagePath.startsWith(prefix)) {
    return;
  }

  const filePath = path.join(process.cwd(), imagePath.replace(/^\//, ""));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  deleteImageFile,
};
