import cloudinaryPackage from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

//Use the correct path to the new keys file
import { cloudinaryKeys } from './envKeys.js'; 

const cloudinary = cloudinaryPackage.v2;

// Configure Cloudinary using the imported keys
cloudinary.config({
cloud_name: cloudinaryKeys.CLOUD_NAME,
api_key: cloudinaryKeys.API_KEY,
api_secret: cloudinaryKeys.API_SECRET
});

// Create Cloudinary storage for Multer
const storage = new CloudinaryStorage({
 cloudinary,
params: {
folder: 'Ecommerce-api', // folder in Cloudinary
 allowed_formats: ['jpg', 'jpeg', 'png'],
public_id: (req, file) => file.originalname.split('.')[0], // original filename
}
});
// Init Multer with Cloudinary storage
const categoryFileUpload = multer({ storage });

export default categoryFileUpload;