locals {
  prefix = "env-"
}

resource "aws_dynamodb_table" "items" {
  name           = "${local.prefix}items"
  write_capacity = 1
  read_capacity  = 1

  hash_key = "item_id"

  attribute {
    name = "item_id"
    type = "S"
  }
}


resource "aws_dynamodb_table" "notes" {
  name           = "${local.prefix}notes"
  write_capacity = 1
  read_capacity  = 1

  hash_key  = "item_id"
  range_key = "note_id"


  attribute {
    name = "item_id"
    type = "S"
  }

  attribute {
    name = "note_id"
    type = "S"
  }
}

