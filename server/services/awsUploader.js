const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (filePath, type) => {
  const fileStream = fs.createReadStream(filePath);
  const fileExtension = path.extname(filePath);
  const uniqueFileName = `${type}s/${uuidv4()}${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uniqueFileName,
    Body: fileStream,
    ContentType: type === "video" ? "video/mp4" : "image/jpeg",
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
 
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    return { Location: fileUrl };
  } catch (err) {
    console.error("S3 upload error:", err);
    throw err;
  }
};

module.exports = uploadToS3;