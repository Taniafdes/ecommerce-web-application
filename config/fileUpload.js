import cloudinaryPackage from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
const cloudinary = cloudinaryPackage.v2

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_S_KEY
})

// create storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
  params: {
    folder: "Ecommerce-api",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => file.originalname.split(".")[0],
  },
})

// Init multer with storage engine
const upload = multer({
    storage
});

export default upload;