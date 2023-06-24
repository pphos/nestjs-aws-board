#!/bin/bash

####################################
# アクセストークンを取得するスクリプト
####################################

set -euo pipefail

readonly PROFILE="cli"

# AssumeRoleに必要な情報を取得
source_profile=$(aws configure get source_profile --profile "${PROFILE}")
role_arn=$(aws configure get role_arn --profile "${PROFILE}")
mfa_serial=$(aws configure get mfa_serial --profile "${PROFILE}")
role_session_prefix=$(date +%s)

# MFA Tokenの読み取り
read -sp "Enter MFA code for ${mfa_serial}:" token

# AssumeRole実施
assumed_result=$(aws sts assume-role \
  --role-arn "${role_arn}" \
  --serial-number "${mfa_serial}" \
  --role-session-name "${role_session_prefix}-session" \
  --profile "${source_profile}" \
  --duration-second 3600 \
  --token-code "${token}"
)

# 認証情報の取り出し
AWS_ACCESS_KEY_ID=$(echo "${assumed_result}" | jq .Credentials.AccessKeyId)
AWS_SECRET_ACCESS_KEY=$(echo "${assumed_result}" | jq .Credentials.SecretAccessKey)
AWS_SESSION_TOKEN=$(echo "${assumed_result}" | jq .Credentials.SessionToken)

# 環境変数の表示
echo ""
echo "========================================"
echo "Copy and pase bellow enviroment variables"
echo "========================================"
echo "export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} && export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} && export AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}"
