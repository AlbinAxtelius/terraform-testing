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
