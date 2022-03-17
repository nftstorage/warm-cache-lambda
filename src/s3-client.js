'use strict'

const aws = require('aws-sdk')

class S3Client {
  /**
   * @param {import('./logging.js').Logger} logger
   */
  constructor(logger) {
    this.s3 = new aws.S3({ apiVersion: '2006-03-01' })
    this.logger = logger
  }

  /**
   * @param {string} bucket
   * @param {string} key
   */
  async headObject(bucket, key) {
    let s3Object

    try {
      this.logger.debug(key, `Getting object ${key} from bucket ${bucket}`)

      s3Object = await this.s3
        .headObject({
          Bucket: bucket,
          Key: key,
        })
        .promise()
    } catch (err) {
      this.logger.error(err, {
        complementMessage: `Error getting object ${key} from bucket ${bucket}: `,
      })
      throw err
    }

    return {
      contentLength: s3Object.ContentLength,
    }
  }
}

module.exports = {
  S3Client,
}
