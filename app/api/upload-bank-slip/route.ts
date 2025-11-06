import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure AWS S3 client
// Log environment variables for debugging (without exposing secrets)
console.log('S3 Configuration:', {
  hasAccessKey: !!process.env.S3_ACCESS_KEY,
  accessKeyLength: process.env.S3_ACCESS_KEY?.length,
  hasSecretKey: !!process.env.S3_SECRET_ACCESS_KEY,
  secretKeyLength: process.env.S3_SECRET_ACCESS_KEY?.length,
  bucketName: process.env.S3_BUCKET_NAME || 'prasad-next-ecommerce',
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

// Use the same bucket as the admin panel for consistency
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'prasad-next-ecommerce';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('bankSlip') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 20MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `bankslip_${timestamp}.${extension}`;
    const s3Key = `bank-slips/${filename}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read' as const,
      ServerSideEncryption: 'AES256' as const,
      Metadata: {
        'original-name': file.name,
        'upload-timestamp': timestamp.toString(),
        'uploaded-from': 'storefront',
      },
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Generate the public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;

    console.log(`Bank slip uploaded to S3 from storefront: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type,
    });

  } catch (error: any) {
    console.error('S3 upload error in storefront:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload bank slip',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
