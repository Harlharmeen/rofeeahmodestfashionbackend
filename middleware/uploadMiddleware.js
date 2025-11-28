import multer from "multer";

// Use memory storage (no files saved to disk)
const storage = multer.memoryStorage();

// Allow only images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG images allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
