locals {
  input_prefix  = "dist/functions"
  output_prefix = "dist/archives"
  functions     = toset([for fn in fileset("${path.module}/${local.input_prefix}", "*.js") : trimsuffix(fn, ".js")])
}

data "archive_file" "lambdas" {
  for_each = local.functions

  type        = "zip"
  source_file = "${local.input_prefix}/${each.key}.js"
  output_path = "${local.output_prefix}/${each.key}_function_payload.zip"
}

resource "aws_lambda_function" "lambdas" {
  for_each = data.archive_file.lambdas

  function_name    = "lambda_${each.key}"
  handler          = "${each.key}.handler"
  filename         = each.value.output_path
  source_code_hash = each.value.output_base64sha256

  role = aws_iam_role.assume_role.arn

  runtime = "nodejs18.x"

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.items.name,
    }
  }
}

