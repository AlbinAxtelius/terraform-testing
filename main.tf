provider "aws" {
  region                   = "eu-central-1"
  profile                  = "default"
  shared_config_files      = ["C:\\Users\\Albin\\.aws\\config"]
  shared_credentials_files = ["C:\\Users\\Albin\\.aws\\credentials"]


  default_tags {
    tags = {
      "project" = "terraform-testing"
    }
  }
}

variable "jwt_signing_key" {
  description = "Key for signing jwt tokens"
  type        = string
  sensitive   = true
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "asm-test"
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_signing_key

  version_stages = ["env"]
}
