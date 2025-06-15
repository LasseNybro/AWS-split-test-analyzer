variable "service_name" {
    type        = string
    description = "Name of the service"
}

variable "dynamodb_arn" {
    type        = string
    description = "Arn of the dynamo database"
}

variable "dynamodb_table_name" {
    type        = string
    description = "Name of the dynamo database table"
}

variable "sqs_queue_arn" {
    type        = string
    description = "Arn of the SQS queue"
  
}