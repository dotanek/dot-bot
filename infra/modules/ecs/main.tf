resource "aws_ecs_cluster" "app_cluster" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_security_group" "app_service" {
  name   = "${var.project_name}-service-sg"
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "${var.project_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = tostring(var.task_cpu)
  memory                   = tostring(var.task_memory)
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "${var.project_name}-app"
      image = "${var.ecr_app_repository_url}:initial"

      portMappings = [
        {
          containerPort = var.app_port
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app_logs.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "app_task"
        }
      }

      secrets = [
        { name = "DATABASE__HOST", valueFrom = var.secrets.app_db_host },
        { name = "DATABASE__NAME", valueFrom = var.secrets.app_db_name },
        { name = "DATABASE__PASSWORD", valueFrom = var.secrets.app_db_password },
        { name = "DATABASE__PORT", valueFrom = var.secrets.app_db_port },
        { name = "DATABASE__SSL", valueFrom = var.secrets.app_db_ssl },
        { name = "DATABASE__USER", valueFrom = var.secrets.app_db_user },
        {
          "name" : "PORT",
          "valueFrom" : "arn:aws:ssm:eu-central-1:523213418935:parameter/dot-bot_port"
        },
        {
          "name" : "TWITCH__CHANNEL",
          "valueFrom" : "arn:aws:ssm:eu-central-1:523213418935:parameter/dot-bot_twitch-channel"
        },
        {
          "name" : "TWITCH__OAUTH_CLIENT_ID",
          "valueFrom" : "arn:aws:ssm:eu-central-1:523213418935:parameter/dot-bot_twitch-oauth-client-id"
        },
        {
          "name" : "TWITCH__OAUTH_CLIENT_SECRET",
          "valueFrom" : "arn:aws:ssm:eu-central-1:523213418935:parameter/dot-bot_twitch-oauth-client-secret"
        },
        {
          "name" : "TWITCH__OAUTH_REDIRECT_URI",
          "valueFrom" : "arn:aws:ssm:eu-central-1:523213418935:parameter/dot-bot_twitch-oauth-redirect-uri"
        },
        {
          "name" : "TWITCH__PREFIX",
          "valueFrom" : "arn:aws:ssm:eu-central-1:523213418935:parameter/dot-bot_twitch-prefix"
        }
      ]

      essential = true
    }
  ])
}

resource "aws_ecs_service" "app_service" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.app_service.id]
    assign_public_ip = true
  }
}

resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 5
}

output "app_security_group_id" {
  description = "Security group of the app service"
  value       = aws_security_group.app_service.id
}
