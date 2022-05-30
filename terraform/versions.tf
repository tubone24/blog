terraform {
  required_version = "1.2.1"
  required_providers {
    netlify = {
      source  = "ttbud/terraform-provider-netlify"
      version = "1.0.0"
    }
  }
}