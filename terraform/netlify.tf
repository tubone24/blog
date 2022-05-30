variable "netlify_token" {
  type        = string
  description = "Token"
}

variable "netlify_base_url" {
  type        = string
  description = "URL"
}

provider "netlify" {
  token    = var.netlify_token
  base_url = var.netlify_base_url
}

resource "netlify_site" "blog" {
  name = "pensive-lamport-5822d2"
  command = "npm run build"
  custom_domain = "https://blog.tubone-project24.xyz"
  repo {
    provider    = "github"
    dir = "public"
    repo_branch = "master"
    repo_path   = "tubone24/blog"
  }
}
