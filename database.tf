locals {
  prefix = "env-"
}

resource "aws_dynamodb_table" "items" {
  name           = "${local.prefix}items"
  write_capacity = 1
  read_capacity  = 1

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

