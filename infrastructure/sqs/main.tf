resource "aws_sqs_queue" "dlq_queue" {
  name = "${var.service_name}-dlq-queue"

  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 1209600 # 14 days
  receive_wait_time_seconds = 10

  tags = {
    Name = "${var.service_name}-dlq-queue"
  }
}

resource "aws_sqs_queue" "queue" {
  name = "${var.service_name}-queue"

  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq_queue.arn
    maxReceiveCount     = 4
  })

  tags = {
    Name = "${var.service_name}-queue"
  }
}

resource "aws_sqs_queue_redrive_allow_policy" "terraform_queue_redrive_allow_policy" {
  queue_url = aws_sqs_queue.dlq_queue.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.queue.arn]
  })
}
