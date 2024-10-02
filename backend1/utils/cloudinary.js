import { v2 as cloudinary } from "cloudinary";

// CLOUDINARY CONFIGURATION
cloudinary.config({
  cloud_name: "djjg3knsl",
  api_key: "213681769223541",
  api_secret: "i7cHPPVUsSFIOTdROg6y1sK33OQ",
  secure: true, // TO GENERATE HTTPS URLS
});

export default cloudinary
