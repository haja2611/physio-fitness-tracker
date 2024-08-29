const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3({ params: { Bucket: process.env.AWS_S3_BUCKET } });
module.exports = s3;
