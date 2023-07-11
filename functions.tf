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

  role = aws_iam_role.iam_for_lambda.arn

  runtime = "nodejs16.x"

  environment {
    variables = {
      myVariable = "Hello world"
    }
  }



}

# Layers

# data "archive_file" "lambda_layer" {
#   type        = "zip"
#   output_path = "dist/layer/nodejs_layer_payload.zip"
#   source_dir  = "dist/nodejs"

#   depends_on = [
#     null_resource.zip_layer,
#   ]
# }

# resource "aws_s3_bucket" "lambda_layers" {
#   bucket = "lambda-layers"
# }

# resource "aws_s3_bucket_object" "lambda_layer" {
#   bucket = aws_s3_bucket.lambda_layers.bucket
#   key    = "nodejs.zip"

#   etag   = data.archive_file.lambda_layer.output_base64sha256
#   source = data.archive_file.lambda_layer.output_path

#   depends_on = [
#     null_resource.zip_layer,
#   ]
# }

# resource "null_resource" "zip_layer" {
#   triggers = {
#     updated_at = timestamp()
#   }

#   provisioner "local-exec" {
#     command     = <<EOF
#     pnpm install --production
#     mkdir -p dist/nodejs
#     cp -r node_modules dist/nodejs
#     EOF
#     working_dir = "${path.module}/dist/layer}"
#   }
# }

# resource "aws_lambda_layer_version" "lambda_dependencies" {
#   layer_name          = "node16x_dependencies"
#   compatible_runtimes = ["nodejs16.x"]

#   s3_bucket = aws_s3_bucket.lambda_layers.bucket
#   s3_key    = aws_s3_bucket_object.lambda_layer.key

#   depends_on = [
#     aws_s3_bucket_object.lambda_layer,
#     null_resource.zip_layer
#   ]
# }
