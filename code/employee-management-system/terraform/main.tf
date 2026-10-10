terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.80"
    }
  }
}
provider "aws" {
  region = var.aws_region
}
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.21.0"
  name = "${var.cluster_name}-vpc"
  cidr = "10.0.0.0/16"
  azs = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  enable_nat_gateway = true
  single_nat_gateway = true
  enable_dns_hostnames = true
  tags = { Environment = var.environment, Project = "EMS" }
}
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.31.6"
  cluster_name = var.cluster_name
  cluster_version = var.kubernetes_version
  cluster_endpoint_public_access = true
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.medium"]
      min_size = 1
      max_size = 2
      desired_size = 1
    }
  }
  tags = { Environment = var.environment, Project = "EMS" }
}
