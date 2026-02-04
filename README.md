# Novel API - 2025 Edition

![Node](https://img.shields.io/badge/Node-v20.9.0-blue?style=for-the-badge)
![Fastify](https://img.shields.io/badge/Fastify--blue?style=for-the-badge)
![Puppeteer](https://img.shields.io/badge/Puppeteer--blue?style=for-the-badge)
![redis](https://img.shields.io/badge/redis--blue?style=for-the-badge)

**A modernized REST API for light, wuxia, and web novels, rebuilt with Fastify and Puppeteer to deliver greater efficiency, scalability, and reliability. Designed primarily for educational and research purposes, this project demonstrates advanced techniques in web scraping, API architecture, and distributed data caching.**

## What's New

- **Modernized Tech Stack**: Migrated from Express to Fastify, enabling faster request handling and lower overhead for high-performance APIs.
- **Intelligent Scraping with Puppeteer**: Integrated Puppeteer for robust, dynamic content extraction with support for concurrent scraping.
- **Performance and Resilience**: Leveraged Redis caching to minimize redundant scraping, reduce server load, and ensure consistently responsive results.

## Disclaimer and Purpose

This project and all associated code and documentation are intended **solely for educational and study purposes**. It serves as a practical example of web scraping, API design, and data handling techniques. It is not intended for commercial use or deployment in production environments. The creators and contributors assume no liability for any misuse of the project or any damages resulting from its use. Users are expected to adhere to these guidelines and use the project responsibly.

## Previous Version

Previous Version remain accessible to read, with documentation available at: [p2-iproject-server](https://github.com/dzulfiqarzaky/p2-iproject-server/tree/development/scraper).

## Engineering Decisions & Architecture

This project adopts a **layered architecture** to separate concerns, ensuring scalability, maintainability, and testing isolation.

### 1. Architecture: The "Thin Controller" Pattern
We intentionally keep Controllers minimal. They are responsible only for:
- Parsing incoming HTTP requests (parameters, query strings).
- Invoking the appropriate Service.
- Returning the formatted HTTP response.

**Why?** This decoupling means valid business logic (e.g., "Check Cache, if miss then Scrape") resides in the **Service Layer** (`src/services/novel.service.ts`). The Controller does not need to know about Redis keys or Puppeteer instances, making the code easier to test and refactor.

### 2. Service Layer: The Coordinator
The `NovelService` acts as the brain. It doesn't scrape data itself; it orchestrates the **"Cache-First" Strategy**.
1. **Cache Check**: Checks Redis for existing data.
2. **Fallback**: If data is missing (Cache Miss), it calls the specific `Scrapper` function.
3. **Storage**: The result from the Scrapper is cached in Redis with a specific TTL (based on volatility, e.g., Homepage caches expire faster than Novel Details).
4. **Response**: Returns the data to the controller.

### 3. Scrapper Design: Modular Composition
Scraping logic is brittle—HTML structures change often. To mitigate this, we decompose every scraping job (Home, List, Detail, Chapter) into four distinct components:
- **Config**: Pure constants (Start URLs, CSS implementation selectors). When a site updates its class names, we only edit this file.
- **Parser**: Runs inside the browser context (Puppeteer). It extracts raw strings from the DOM.
- **Normalizer**: Pure functions that clean dirty data (trimming whitespace, fixing URLs, removing ads).
- **Orchestrator**: The main function that ties it all together (Navigates -> Waits -> Parses -> Normalizes).

### 4. Browser Management: Singleton & Concurrency Control
Launching a headless browser is expensive (CPU/RAM).
- **Singleton Pattern**: We maintain a single `Shared Browser Instance` throughout the application lifecycle (via `src/services/puppeteer/puppeteer.ts`), rather than launching a new browser per request.
- **Job Queue**: To prevent getting IP-banned or crashing the server, concurrent scraping jobs are limited via `src/services/scrapper/utils/jobScheduler.ts`. Requests queue up rather than spamming the target site simultaneously.

### 5. Type Safety
The entire codebase is strictly typed with **TypeScript**. We define interfaces for our Models (`src/models`) and shared types (`src/interfaces`), ensuring that data shapes are consistent from the scraper output all the way to the API response.
