variable "project_name" {
  type        = string
  description = "Used as a prefix for resource names"
}

variable "region" {
  type = string
}

variable "account_id" {
  type        = string
  description = "Account id from caller identity"
}

variable "ecr_app_repository_url" {
  type        = string
  description = "Url of the ECR repository for the application"
}

variable "task_cpu" {
  type        = number
  description = "Fargate task CPU units (256, 512, 1024, 2048, 4096)"
  default     = 512
}

variable "task_memory" {
  type        = number
  description = "Fargate task memory in MB (must be a valid pairing with task_cpu)"
  default     = 1024
}

variable "app_port" {
  type        = number
  description = "Port on which application will be accepting requests on"
  default     = 5000
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC where the ECS tasks and security group are created"
}

variable "subnet_ids" {
  type        = list(string)
  description = "IDs of the subnets where the ECS service runs its tasks"
}

variable "secrets" {
  description = "SSM parameter ARNs for the app's secrets"
  type = object({
    db_host                    = string
    db_name                    = string
    db_password                = string
    db_port                    = string
    db_ssl                     = string
    db_user                    = string
    port                       = string
    twitch_channel             = string
    twitch_oauth_client_id     = string
    twitch_oauth_client_secret = string
    twitch_oauth_redirect_uri  = string
    twitch_prefix              = string
  })
}