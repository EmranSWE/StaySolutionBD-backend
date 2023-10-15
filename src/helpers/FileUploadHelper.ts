import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import * as fs from 'fs'

import { ICloudinaryResponse, IUploadFile } from '../interface/file'
cloudinary.config({
  cloud_name: 'dyxyo086c',
  api_key: '871945142726864',
  api_secret: 'zjJhzteykweJmxN5c3j6VDZuU10',
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (
  file: IUploadFile,
): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path)
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )
  })
}

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
}
