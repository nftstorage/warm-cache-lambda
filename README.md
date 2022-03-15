# warm-cache-lambda

The `warm-cache` lambda will trigger on writes to a given S3 bucket with a `complete` key prefix. CAR files written with such prefix have a validated full dag.

## Assumptions

There are a few assumptions in place and this lambda function will assemble CARs if:
- S3 Object Metadata has a "Complete" structure 
- S3 Object has a DagPB encoded root with a known size __acceptable__ (100MB) and the S3 directory for that root CID already has all the DAG chunks

## AWS Setup

This project already comes with a script for build and deploy (which is also integrated with Github Actions). However it needs:
- Project creation in AWS
  - It needs a role policy with S3 `s3:HeadObject` privileges
- Secrets setup in Repo secrets for automatic deploy
- Environment variables setup

For bootstrapping AWS project, a `.env.local` file must be created in the root directory with:

```env
# AWS Lambda setup
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET=""
NAME="dotstorage-assemble-cars"
```

Then, you can init AWS using:

```sh
npm run init
```

## Production Setup

The following environment variables are needed in AWS:

```env
# Lambda ENV
API_ENDPOINT="https://nftstorage.link/cache/warm/"
MAX_SIZE_TO_ATTEMPT=104857600
```
