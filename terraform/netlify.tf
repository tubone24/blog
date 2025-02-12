variable "netlify_token" {
  type = string
}

provider "netlify" {
  token    = var.netlify_token
}

resource "netlify_site" "main" {
  name = "pensive-lamport-5822d2"
  custom_domain = "tubone-project24.xyz"
}
