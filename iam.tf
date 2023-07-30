data "aws_iam_policy_document" "assume_role_doc" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

resource "aws_iam_role" "assume_role" {
  name               = "AssumeRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_doc.json
  managed_policy_arns = [
    aws_iam_policy.read_db_policy.arn,
    aws_iam_policy.log_to_cloudwatch_policy.arn
  ]

  depends_on = [
    aws_iam_policy.read_db_policy,
    aws_iam_policy.log_to_cloudwatch_policy
  ]
}

data "aws_iam_policy_document" "read_db_policy_doc" {
  statement {
    sid    = "1"
    effect = "Allow"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
      "dynamodb:PutItem",
      "secretsmanager:GetSecretValue"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_policy" "read_db_policy" {
  name        = "ReadDBPolicy"
  path        = "/"
  description = "TBD"

  policy = data.aws_iam_policy_document.read_db_policy_doc.json
}

data "aws_iam_policy_document" "log_to_cloudwatch_policy_doc" {
  statement {
    sid    = "1"
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_policy" "log_to_cloudwatch_policy" {
  name        = "LogToCloudWatch"
  path        = "/"
  description = "TBD"

  policy = data.aws_iam_policy_document.log_to_cloudwatch_policy_doc.json
}
