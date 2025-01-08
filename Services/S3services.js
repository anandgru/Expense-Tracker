const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uploadToS3= async(data, fileName)=>{
    const region = 'eu-north-1'; // Make sure this is the correct region for your bucket

    // Create a new S3 client with the correct region
    const s3 = new S3Client({
        region: region, // Specify the correct region for your bucket
        credentials: {
            accessKeyId: process.env.IAM_USER_KEY,
            secretAccessKey: process.env.IAM_USER_SECRET
        }
    });


    // Set the S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName, // Use the sanitized file name without re-encoding
        Body: data,
        ACL: 'public-read', // Set the ACL to make the file publicly readable
        ContentType: 'text/plain'
    };

    try {
        // Upload the file to S3
        const command = new PutObjectCommand(params);
        await s3.send(command);
        console.log(`Successfully uploaded ${fileName} to S3`);

        // Construct the public file URL
        const fileURL = `https://${process.env.BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;
        return fileURL;
    } catch (err) {
        console.error('Error uploading to S3:', err);
        throw new Error('Failed to upload to S3');
    }
}

module.exports = { uploadToS3 };