import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'news-api',
        },
        (error, result) => {
          if (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : typeof error === 'object'
                  ? JSON.stringify(error)
                  : String(error);
            return reject(new Error(errorMessage));
          }
          if (!result) {
            return reject(new Error('Upload failed: result is undefined'));
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
