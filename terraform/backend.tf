terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "tubone24-test"

    workspaces {
      name = "blog"
    }
  }
}
