resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_security_group" "app_db" {
  name   = "${var.project_name}-db-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.ecs_security_group_id]
  }
}

resource "aws_db_subnet_group" "app_db_subnet" {
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "app_db" {
  identifier          = "${var.project_name}-db"
  allocated_storage   = 10
  db_name             = "postgres"
  engine              = "postgres"
  engine_version      = "18.3"
  instance_class      = "db.t3.micro"
  username            = "postgres"
  password            = random_password.password.result
  skip_final_snapshot = true

  db_subnet_group_name   = aws_db_subnet_group.app_db_subnet.name
  vpc_security_group_ids = [aws_security_group.app_db.id]
  publicly_accessible    = false
}

output "app_db_config" {
  value = {
    host     = aws_db_instance.app_db.address
    port     = aws_db_instance.app_db.port
    name     = aws_db_instance.app_db.db_name
    user     = aws_db_instance.app_db.username
    password = random_password.password.result
  }
  sensitive = true
}