variable "netlify_token" {
}

variable "netlify_base_url" {
}

provider "netlify" {
  token    = var.netlify_token
  base_url = var.netlify_base_url
}

resource "netlify_site" "main" {
  name = "pensive-lamport-5822d2"
  custom_domain = "https://blog.tubone-project24.xyz"
  repo {
    command = "npm run build"
    provider    = "github"
    dir = "public"
    repo_branch = "master"
    repo_path   = "tubone24/blog"
  }
}
