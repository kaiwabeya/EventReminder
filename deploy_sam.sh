#!/usr/bin/env bash

set -eu

usage() {
    echo "Usage: deploy_sam.sh [--functionname functionname]"
    exit 1
}

for OPT in "$@"
do
    case "$OPT" in
        '--help' )
            usage
            exit 0
            ;;
        '--functionname' )
            FUNCTION_NAME="$2"
            shift 2
            ;;
    esac
done

if [ -z "$FUNCTION_NAME" ]; then
    usage
    exit 1
fi

COMPONENT_NAME=systemperformance
ARTIFACTS_BUCKET=kaiwabeya-${COMPONENT_NAME}-scripts-artifact
STACK_NAME=${COMPONENT_NAME}-${FUNCTION_NAME}
echo "deploy ${FUNCTION_NAME} to ${ENV_NAME}-${ENV_TYPE} with profile ${AWS_PROFILE}"

sam build --use-container
sam package --s3-bucket ${ARTIFACTS_BUCKET} --output-template-file .aws-sam/build/packaged.yaml
aws cloudformation deploy \
    --stack-name ${STACK_NAME} \
    --template-file .aws-sam/build/packaged.yaml \
    --region ap-northeast-1 \
    --parameter-overrides ComponentName=${COMPONENT_NAME} \
    --no-fail-on-empty-changeset \
    --capabilities CAPABILITY_NAMED_IAM \
    --tags ComponentName=${COMPONENT_NAME}
