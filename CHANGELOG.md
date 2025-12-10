# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [versioning_guide] - DD.MM.YYYY

### Features

### Fixed

### Removed

## [1.2.0] - 10.12.2025

### Features

- novel_server: split Chrome into separate browserless container via Docker Compose.
- novel_server: add Redis as separate container with persistent volume.
- novel_server: refactor Dockerfile to slim image (no Chromium, only CA certs).
- novel_server: add `REDIS_TIME_CONFIG` constants for readable TTL values.

### Fixed

- novel_server: fix puppeteer connection reuse issue with browserless (fresh connection per request).
- novel_server: add `127.0.0.1:5173` to CORS whitelist for local development.

## [1.1.0] - 06.10.2025

### Features

- novel_scrapper: add dockerfile, add compose.yaml.
- novel_scrapper: move redis from local to redis.io.
- novel_scrapper: update bundle using esbuild to minify docker image size.

## [1.0.0] - 06.10.2025

### Features

- novel_scrapper: add redis, add plugins for import.

[versioning_guide]: https://github.com/dzulfiqarzaky19/novel_scrapper/compare/main...novel_scrapper-add-redis
[1.0.0]: https://github.com/dzulfiqarzaky19/novel_scrapper/releases/tag/1.0.0
[1.1.0]: https://github.com/dzulfiqarzaky19/novel_scrapper/releases/tag/1.1.0
