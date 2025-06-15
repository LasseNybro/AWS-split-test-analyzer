variable "service_name" {
    type        = string
    description = "Name of the service"
}

variable "sqs_queue_id" {
    type        = string
    description = "Id/Url of the SQS queue"
}

variable "sqs_queue_arn" {
    type        = string
    description = "Arn of the SQS queue"
}