import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import * as streamifier from 'streamifier';

@Injectable()
export class FilesService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'tourism-project' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ secureUrl: result.secure_url });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
