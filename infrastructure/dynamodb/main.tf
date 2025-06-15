resource "aws_dynamodb_table" "dynamodb_table" {
  name         = "${var.service_name}-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "customerId"
  range_key    = "userId_ExperimentalId"

  attribute {
    name = "customerId"
    type = "S"
  }

  attribute {
    name = "userId_ExperimentalId"
    type = "S"
  }

  tags = {
    service_name = var.service_name
  }
}