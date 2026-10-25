# General

variable "project_name" {
  type        = string
  description = "Used as a prefix for resource names"
}

variable "region" {
  type        = string
  description = "AWS region where resources are deployed"
}

# ECS
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