#!/bin/bash

set -eu

COMPONENT_NAME="event-reminder"
SEMINAR_TITLE="data-management-at-scale"
APP_NAME="event-reminder"

# Create S3 bucket for SAM artifacts
ARTIFACTS_BUCKET="${COMPONENT_NAME}-sam-artifacts"
aws s3 mb s3://${ARTIFACTS_BUCKET} --region ap-northeast-1 || true

# Build and deploy
STACK_NAME="${APP_NAME}-${SEMINAR_TITLE}"

sam build
sam package \
    --s3-bucket ${ARTIFACTS_BUCKET} \
    --s3-prefix ${SEMINAR_TITLE} \
    --output-template-file .aws-sam/build/packaged.yaml
sam deploy \
    --stack-name ${STACK_NAME} \
    --template-file .aws-sam/build/packaged.yaml \
    --no-fail-on-empty-changeset \
    --region ap-northeast-1 \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --tags ComponentName=${COMPONENT_NAME}


