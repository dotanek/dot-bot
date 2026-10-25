terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.69.0"
    }
  }
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

module "vpc" {
  source = "./modules/vpc"
}

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
}

module "ecs" {
  source = "./modules/ecs"

  project_name = var.project_name
  region       = var.region
  account_id   = data.aws_caller_identity.current.account_id

  ecr_app_repository_url = module.ecr.app_repository_url

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.subnet_ids

  secrets = module.params.secrets
}

module "rds" {
  source = "./modules/rds"

  project_name = var.project_name

  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.subnet_ids
  ecs_security_group_id = module.ecs.app_security_group_id
}

module "params" {
  source = "./modules/params"

  project_name = var.project_name

  rds_app_db_host     = module.rds.app_db_config.host
  rds_app_db_port     = module.rds.app_db_config.port
  rds_app_db_name     = module.rds.app_db_config.name
  rds_app_db_user     = module.rds.app_db_config.user
  rds_app_db_password = module.rds.app_db_config.password
}