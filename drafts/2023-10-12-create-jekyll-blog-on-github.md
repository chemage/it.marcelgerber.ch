---
title: Create a blog with Jekyll on GitHub
date: 2023-10-12 18:00:00 +0200
categories: howto
tags: website jekyll github
---

# {{ title }}

## Short Steps

1. Install Ruby on your development platform.
https://www.ruby-lang.org/en/documentation/installation/
1. Install RubyGems and Jekyll as normal user.
https://jekyllrb.com/docs/installation/
```bash
gem install jekyll bundler
```
1. Create a repository on GitHub.
Consider browsing and choosing a theme, as it's easiest to use a theme repository as template for your web site.
1. Create CNAME file for the repository.
1. Configure Jekyll action for the repository.
1. Configure your DNS records if using a custom domain name.
1. Bundle your repository.
```bash
bundle
```
