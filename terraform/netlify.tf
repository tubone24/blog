variable "netlify_token" {
  type = string
}

provider "netlify" {
  token    = var.netlify_token
}

resource "netlify_site" "main" {
  name = "pensive-lamport-5822d2"
  custom_domain = "blog.tubone-project24.xyz"
  site_id = "3751ef40-b145-4249-9657-39d3fb04ae81"
}
