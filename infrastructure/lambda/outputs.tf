output "lambda_arn" {
    value = aws_lambda_function.lambda.arn
}

output "lambda_name" {
    value = var.service_name
}
