output "sqs_queue_arn" {
  value = aws_sqs_queue.queue.arn
}

output "sqs_queue_id" {
  value = aws_sqs_queue.queue.id
}
