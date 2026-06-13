const fs = require("fs");
const path = require("path");

const deleteBannerImageFile = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return;
  }

  if (!imageUrl.startsWith("/uploads/banners/")) {
    return;
  }

  const filePath = path.join(process.cwd(), imageUrl.replace(/^\//, ""));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  deleteBannerImageFile,
};
