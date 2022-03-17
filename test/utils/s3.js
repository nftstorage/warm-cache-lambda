const createS3PutEvent = ({
  bucketName = 'test-bucket',
  objectKey = 'complete/bafybeif3hyrtm2skjmldufjid3myfp37sxyqbtz7xe3f2fqyd7ugi33b2a.car'
} = {}) => ({
  Records: [{
    s3: {
      bucket: {
        name: bucketName
      },
      object: {
        key: objectKey
      }
    }
  }]
})

module.exports = {
  createS3PutEvent
}
