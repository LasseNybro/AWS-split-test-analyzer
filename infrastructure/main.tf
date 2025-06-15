terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    key            = "terraform.tfstate"
    region         = "eu-north-1"
  }
}

provider "aws" {
  region = "eu-north-1"
}

locals {
    service_name = "split-test-analyser"
}

module "dynamodb" {
    source = "./dynamodb"

    service_name = local.service_name
}

module "lambda" {
    source = "./lambda"

    service_name  = local.service_name
    dynamodb_arn  = module.dynamodb.dynamodb_arn
    sqs_queue_arn = module.sqs.queue_arn
    dynamodb_table_name = module.dynamodb.dynamodb_table_name
}

module "sqs" {
    source = "./sqs"

    service_name = "${local.service_name}-data"
}

module "api_gateway" {
    source = "./api-gateway"

    service_name          = local.service_name
    sqs_queue_id          = module.sqs.queue_id
}
