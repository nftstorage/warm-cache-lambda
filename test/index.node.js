const { serial: test } = require('ava')
const aws = require('aws-sdk-mock')

const { handler } = require('../src/index') // lambda function
const { createS3PutEvent } = require('./utils/s3')

test.afterEach(t => {
  aws.restore('S3')
})

test('should fail if triggered not by a complete car', async t => {
  const error = await t.throwsAsync(() => handler(
    createS3PutEvent({
      objectKey: 'raw/bafybeif3hyrtm2skjmldufjid3myfp37sxyqbtz7xe3f2fqyd7ugi33b2a.car'
    })
  ))
  t.is(error.message, 'lambda should only triggered with complete namespace: CAR with raw/bafybeif3hyrtm2skjmldufjid3myfp37sxyqbtz7xe3f2fqyd7ugi33b2a.car from bucket test-bucket')
})

test('should not try to warm cache for complete car with big size', async t => {
  const cid = 'bafybeif3hyrtm2skjmldufjid3myfp37sxyqbtz7xe3f2fqyd7ugi33b2a'
  const key = `complete/${cid}.car`
  const ContentLength = 600 * 1024 * 1024

  // Mock S3
  aws.mock('S3', 'headObject', (params) => {
    if (params.Key === key) {
      return Promise.resolve({
        ContentLength,
      })
    }
    return Promise.reject('invalid s3 object requested')
  })

  const { contentLength, rootCid, warmedCache } = await handler(createS3PutEvent({ objectKey: key }))
  t.deepEqual(rootCid, cid)
  t.deepEqual(contentLength, ContentLength)
  t.deepEqual(warmedCache, false)
})

test('should try to warm cache for complete car with acceptable size', async t => {
  const cid = 'bafybeif3hyrtm2skjmldufjid3myfp37sxyqbtz7xe3f2fqyd7ugi33b2a'
  const key = `complete/${cid}.car`
  const ContentLength = 50 * 1024 * 1024
  // Mock S3
  aws.mock('S3', 'headObject', (params) => {
    if (params.Key === key) {
      return Promise.resolve({
        ContentLength,
      })
    }
    return Promise.reject('invalid s3 object requested')
  })

  const { contentLength, rootCid, warmedCache } = await handler(createS3PutEvent({ objectKey: key }))
  t.deepEqual(rootCid, cid)
  t.deepEqual(contentLength, ContentLength)
  t.deepEqual(warmedCache, true)
})
