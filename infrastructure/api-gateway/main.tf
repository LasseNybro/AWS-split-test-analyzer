resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "${var.service_name}-api"
  description   = "The API Gateway for Service"
  protocol_type = "HTTP"
  version       = 1
  tags          = {
    service_name = var.service_name
  }
}

resource "aws_apigatewayv2_integration" "api_gateway_sqs_integration" {
  api_id              = aws_apigatewayv2_api.api_gateway.id
  credentials_arn     = aws_iam_role.api_gateway_role.arn
  description         = "SQS Integration for API Gateway POST endpoint"
  integration_type    = "AWS_PROXY"
  integration_subtype = "SQS-SendMessage"

  request_parameters = {
    "QueueUrl"    = var.sqs_queue_id
    "MessageBody" = "$request.body.message"
  }

  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "api_gateway_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "POST /data"
  target    = "integrations/${aws_apigatewayv2_integration.api_gateway_sqs_integration.id}"
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_iam_role" "api_gateway_role" {
  name = "${var.service_name}-api-gateway-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect: "Allow",
        Principal: {
          Service: "apigateway.amazonaws.com"
        },
        Action: "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "api_gateway_policy" {
  name = "${var.service_name}-api-gateway-policy"
  role = aws_iam_role.api_gateway_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect: "Allow",
        Action: [
          "sqs:SendMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource: var.sqs_queue_id
      }
    ]
  })
}

# resource "aws_apigatewayv2_integration" "api_gateway_integration" {
#   api_id           = aws_apigatewayv2_api.api_gateway.id
#   integration_type = "HTTP_PROXY"

#   connection_type           = "INTERNET"
#   description               = "Endpoint that saves JSON formatted data"
#   integration_method        = "POST"
#   integration_uri           = var.lambda_arn
# }

# resource "aws_lambda_permission" "api_gateway_permission" {
#   statement_id  = "AllowAPIGatewayInvoke"
#   action        = "lambda:InvokeFunction"
#   function_name = var.lambda_name
#   principal     = "apigateway.amazonaws.com"

#   source_arn = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/POST"
# }