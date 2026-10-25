resource "aws_ecr_repository" "ecr_app_repository" {
  name                 = "${var.project_name}-app"
  image_tag_mutability = "IMMUTABLE_WITH_EXCLUSION"

  image_tag_mutability_exclusion_filter {
    filter      = "initial"
    filter_type = "WILDCARD"
  }

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "ecr_app_repository" {
  repository = aws_ecr_repository.ecr_app_repository.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = { type = "expire" }
    }]
  })
}

output "app_repository_url" {
  description = "ECR repository URL without a tag"
  value       = aws_ecr_repository.ecr_app_repository.repository_url
}
