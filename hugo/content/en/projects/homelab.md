+++
title = "homelab"
description = "IaC and config repository for my tiny homelab"
stars = 0
downloads = 0
forks = 0
license = ""
homepage_url = ""
repo_url = "https://github.com/Tarasa24/homelab"
lang = [
  { language = "HCL", color = "#844FBA", ratio = 0.78 },
  { language = "Jinja", color = "#a52a22", ratio = 0.17 },
  { language = "Shell", color = "#89e051", ratio = 0.04 }
]
+++

1. Add ssh pubkey to pve's authorized_keys file
2. Run `ansible-playbook playbooks/pve/pve_init.yml` to initialize the pve host to basic known state
3. Run `terraform apply`