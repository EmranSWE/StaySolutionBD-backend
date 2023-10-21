/* eslint-disable no-undef */
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

import { ICloudinaryResponse } from '../interface/file'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadToCloudinary = async (
  fileBuffer: Buffer,
): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result as unknown as ICloudinaryResponse)
        }
      })
      .end(fileBuffer)
  })
}

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
}
