'use strict'

require('dotenv').config()

const { API_ENDPOINT: apiEndpoint, MAX_SIZE_TO_ATTEMPT } = process.env
// Defaults to 100MB
const maxSizeToAttempt = MAX_SIZE_TO_ATTEMPT || 100 * 1024 * 1024

module.exports = {
  apiEndpoint,
  maxSizeToAttempt,
}
