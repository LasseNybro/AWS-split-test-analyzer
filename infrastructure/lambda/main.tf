resource "aws_lambda_function" "lambda" {
  filename         = "${path.root}/../packages/api/POST/data/post-data-lambda-code.zip"
  source_code_hash = filebase64sha256("${path.root}/../packages/api/POST/data/post-data-lambda-code.zip")
  function_name    = var.service_name
  role             = aws_iam_role.lambda_iam.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = var.dynamodb_table_name
    }
  }
}

resource "aws_cloudwatch_log_group" "handler_lambda" {
  name = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
}

resource "aws_iam_role" "lambda_iam" {
  name = "${var.service_name}-lambda-iam-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com"
        },
        Action: "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.service_name}-lambda-policy"
  role = aws_iam_role.lambda_iam.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:GetItem",
          "dynamodb:ConditionCheckItem"
        ],
        Resource: [
          var.dynamodb_arn,
          "${var.dynamodb_arn}/*"
        ]
      },
      {
        Effect: "Allow",
        Action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource: "*"
      },
      {
        Effect: "Allow",
        Action: [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource: var.sqs_queue_arn
      }
    ]
  })
}

resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  batch_size        = 1
  event_source_arn  = "${var.sqs_queue_arn}"
  enabled           = true
  function_name     = "${aws_lambda_function.lambda.arn}"
}

resource "aws_lambda_permission" "allow_sqs" {
  statement_id  = "AllowSQSTrigger"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = var.sqs_queue_arn
}
