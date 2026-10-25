resource "aws_ssm_parameter" "database_host" {
  name  = "${var.project_name}_database-host"
  type  = "String"
  value = var.rds_app_db_host
}

resource "aws_ssm_parameter" "database_name" {
  name  = "${var.project_name}_database-name"
  type  = "String"
  value = var.rds_app_db_name
}

resource "aws_ssm_parameter" "database_password" {
  name  = "${var.project_name}_database-password"
  type  = "SecureString"
  value = var.rds_app_db_password
}

resource "aws_ssm_parameter" "database_port" {
  name  = "${var.project_name}_database-port"
  type  = "String"
  value = var.rds_app_db_port
}

resource "aws_ssm_parameter" "database_ssl" {
  name  = "${var.project_name}_database-ssl"
  type  = "String"
  value = true # need a way to determine this automatically
}

resource "aws_ssm_parameter" "database_user" {
  name  = "${var.project_name}_database-user"
  type  = "String"
  value = var.rds_app_db_user
}

locals {
  manual_parameters = {
    port                       = "String"
    twitch-channel             = "String"
    twitch-oauth-client-id     = "String"
    twitch-oauth-client-secret = "SecureString"
    twitch-oauth-redirect-uri  = "String"
    twitch-prefix              = "String"
  }
}

resource "aws_ssm_parameter" "manual" {
  for_each = local.manual_parameters
  name     = "${var.project_name}_${each.key}"
  type     = each.value
  value    = "placeholder"

  lifecycle {
    ignore_changes = [value]
  }
}

output "secrets" {
  value = {
    db_host                    = aws_ssm_parameter.database_host.arn
    db_name                    = aws_ssm_parameter.database_name.arn
    db_password                = aws_ssm_parameter.database_password.arn
    db_port                    = aws_ssm_parameter.database_port.arn
    db_ssl                     = aws_ssm_parameter.database_ssl.arn
    db_user                    = aws_ssm_parameter.database_user.arn
    port                       = aws_ssm_parameter.manual["port"].arn
    twitch_channel             = aws_ssm_parameter.manual["twitch-channel"].arn
    twitch_oauth_client_id     = aws_ssm_parameter.manual["twitch-oauth-client-id"].arn
    twitch_oauth_client_secret = aws_ssm_parameter.manual["twitch-oauth-client-secret"].arn
    twitch_oauth_redirect_uri  = aws_ssm_parameter.manual["twitch-oauth-redirect-uri"].arn
    twitch_prefix              = aws_ssm_parameter.manual["twitch-prefix"].arn
  }
}

