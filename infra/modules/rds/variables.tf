variable "project_name" {
  type        = string
  description = "Used as a prefix for resource names"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC where the ECS tasks and security group are created"
}

variable "subnet_ids" {
  type        = list(string)
  description = "IDs of the subnets where the ECS service runs its tasks"
}

variable "ecs_security_group_id" {
  type = string
}