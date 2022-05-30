provider "netlify" {
  token    = var.netlify_token
  base_url = var.netlify_base_url
}

resource "netlify_deploy_key" "key" {}

resource "netlify_site" "blog" {
  name = "pensive-lamport-5822d2"
}
