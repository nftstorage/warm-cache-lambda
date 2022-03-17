'use strict'

const fetch = require('node-fetch')

const { S3Client } = require('./s3-client.js')
const { Logger } = require('./logging')
const { apiEndpoint, maxSizeToAttempt } = require('./config')

/**
 * Lambda triggers on S3 write object event for "complete/" prefix.
 */
async function main(event) {
  const logger = new Logger()
  const s3Client = new S3Client(logger)

  // Get the object from the event
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  )

  logger.info(key, `Attempting to warm cache on Car with key ${key}`)

  if (!key.startsWith('complete')) {
    const e = new Error(
      `lambda should only triggered with complete namespace: CAR with ${key} from bucket ${bucket}`
    )
    logger.error(e)
    throw e
  }

  const rootCid = key.replace('complete/', '').replace('.car', '')
  const { contentLength } = await s3Client.headObject(bucket, key)
  if (contentLength <= maxSizeToAttempt) {
    logger.info(key, `Requesting to warm cache on Car with root CID ${rootCid}`)

    // Perform HTTP Request to warm cache
    try {
      // TODO: Needs JWK as follow up PR
      const response = await fetch(`${apiEndpoint}${rootCid}`)
      if (response.ok) {
        logger.info(key, `Cache warmed for Car with root CID ${rootCid}`)
        return { contentLength, rootCid, warmedCache: true }
      }
    } finally {
    }
  }

  logger.info(key, `Cache not warmed for Car with root CID ${rootCid}`)

  return { contentLength, rootCid, warmedCache: false }
}

exports.handler = main
