variable "aws_region" {
  type    = string
  default = "ap-south-1"
}
variable "cluster_name" {
  type    = string
  default = "ems-eks"
}
variable "kubernetes_version" {
  type    = string
  default = "1.32"
}
variable "environment" {
  type    = string
  default = "dev"
}
