import S3 from 'aws-sdk/clients/s3'

import type { IStorageProvider } from '../interface'

export class MinioStorageProvider implements IStorageProvider {
  client: S3

  constructor() {
    this.client = new S3({
      endpoint: process.env.MINIO_ENDPOINT,
      apiVersion: 'latest',
      accessKeyId: process.env.MINIO_ACCESS_KEY,
      secretAccessKey: process.env.MINIO_SECRET_KEY,
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
    })
  }

  async upload(file: File): Promise<string> {
    // Converter o File/Blob para Buffer
    const buffer = await file.arrayBuffer().then(Buffer.from)

    const params = {
      Bucket: process.env.MINIO_BUCKET as string,
      Key: file.name,
      Body: buffer, // Usar o buffer ao invés do arquivo direto
      ACL: 'public-read',
      ContentType: file.type, // Adicionar o tipo do conteúdo
    }

    try {
      const { Location } = await this.client.upload(params).promise()
      return Location
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Erro ao fazer upload do arquivo')
    }
  }

  async delete(path: string): Promise<void> {
    const params = {
      Bucket: process.env.MINIO_BUCKET as string,
      Key: path,
    }

    try {
      await this.client.deleteObject(params).promise()
    } catch (error) {
      console.error('Delete error:', error)
      throw new Error('Error deleting file')
    }
  }
}
