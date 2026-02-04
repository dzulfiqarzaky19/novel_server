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
# Project Structure & File Dictionary

This document provides a comprehensive reference for every file in the `novel_server` project, explaining its specific purpose and responsibility.

## Directory Tree

```
src/
├── config/              # Configuration files and plugin initialization
│   ├── cors.ts          # Encapsulated CORS configuration
│   ├── redis.ts         # Redis client setup and connection logic
│   └── novlove.config.ts # Application-specific constants/config
├── controllers/         # Request handlers binding logic to routes
│   ├── novel.controller.ts       # Main novel data endpoints (Thumb)
│   └── novel-debug.controller.ts # Debugging endpoints
├── services/            # Core business logic and external services
│   ├── novel.service.ts # Business logic for novel operations
│   ├── puppeteer/       # Puppeteer browser instance management
│   └── scrapper/        # Web scraping logic organized by site
├── routes/              # API Route definitions
│   └── novlove.router.ts # Route declarations maps URLs to controllers
├── models/              # Data models and Request/Response types
│   └── novlove.model.ts  # Interfaces for API payloads
├── interfaces/          # Shared TypeScript interfaces
│   ├── fastify.d.ts     # Type augmentation for Fastify instance
│   └── plugins.ts       # Plugin type definitions
├── utils/               # Shared utility functions
│   ├── redisCache.ts    # Caching helper functions
│   └── debugSnap.ts     # Debugging utilities for Puppeteer
└── index.ts             # Application entry point & server setup
```

## Detailed File Descriptions

### **Root (`src/`)**
- **`index.ts`**: The application entry point. It initializes the Fastify server, registers plugins (CORS, Redis, Puppeteer), configures routes, and starts the server on the specified port.

---

### **Configuration (`src/config/`)**
Centralized configuration configuration and plugin setups.
- **`cors.ts`**: Configures Cross-Origin Resource Sharing. It defines the allowed origins (e.g., your frontend URL) and HTTP methods to prevent browser security errors.
- **`novlove.config.ts`**: Contains constants specific to the `Novlove` site integration, such as Redis cache keys and TTL (Time-To-Live) settings for different pages (home, list, detail).
- **`redis.ts`**: Sets up the Redis client. It exports a Fastify plugin that connects to the Redis server defined in environment variables and decorates the Fastify instance with `app.redis`.

---

### **Controllers (`src/controllers/`)**
Handlers for incoming API requests.
- **`novel.controller.ts`**: The primary controller. It parses the request parameters, calls the `NovelService` to get the data, and sends the response. It is now a "thin" controller.
- **`novel-debug.controller.ts`**: Developer tools. It exposes endpoints to directly invoke internal methods or check system state without standard caching, useful for debugging the scraper logic.

---

### **Interfaces (`src/interfaces/`)**
TypeScript type definitions.
- **`fastify.d.ts`**: Module augmentation for Fastify. It tells TypeScript that the `FastifyInstance` has been decorated with custom properties like `puppeteer` and `redis`, preventing type errors when accessing `app.redis`.
- **`plugins.ts`**: Definitions for custom plugin options or shared types related to plugin registration.

---

### **Models (`src/models/`)**
Data structures for API contracts.
- **`novlove.model.ts`**: Defines the TypeScript interfaces for the API request parameters (e.g., `:id`, `:chapter`) and query strings. It ensures the controllers receive strongly-typed inputs.

---

### **Routes (`src/routes/`)**
API Endpoint definitions.
- **`novlove.router.ts`**: Maps HTTP URLs (e.g., `GET /novlove/novel/:name`) to their corresponding functions in the Controller. It acts as the traffic director for the application.

---

### **Services (`src/services/`)**
The core business logic of the application.

- **`novel.service.ts`**: Encapsulates the business logic for novel operations. It handles the "Cache or Scrape" strategy, orchestrating calls to Redis key management and the specific site scrappers.

#### **Puppeteer (`src/services/puppeteer/`)**
Manages the headless browser environment.
- **`puppeteer.const.ts`**: Configuration constants for Puppeteer, such as viewport size, user-agent strings, and timeouts.
- **`puppeteer.ts`**: The main plugin file. It launches the browser instance when the server starts and makes it available globally via `app.puppeteer`. It manages the browser lifecycle.
- **`puppeteer.utils.ts`**: Helper `functions` to manage the singleton browser instance. It handles logic like "get existing browser or launch a new one" and "gracefully close browser".

#### **Scrapper (`src/services/scrapper/`)**
Contains the logic for extracting data from websites.

**Utils (`src/services/scrapper/utils/`)**
- **`evalOrEmpty.ts`**: A safety wrapper for Puppeteer's `page.evaluate`. If a selector isn't found or an error occurs during extraction, it catches the error and returns `null` or empty strings instead of crashing the request.
- **`jobScheduler.ts`**: Implements a queue system (using `p-queue` or similar logic) to limit concurrent scraping operations. This prevents the server from spawning too many tabs and running out of memory.

**Sites (`src/services/scrapper/sites/`)**
Logic is organized by target website. Currently supports `novlove`.

**Shared Files:**
- **`novlove/url.ts`**: Utilities for URL manipulation specific to Novlove. It handles converting relative paths to absolute URLs and extracting slugs from URLs.

**Feature: Chapter (`src/services/scrapper/sites/novlove/chapter/`)**
- **`chapterScrapper.config.ts`**: Defines the DOM selectors (e.g., title, content body, next button) and the base URL pattern for chapters.
- **`chapterScrapper.normalizer.ts`**: Cleans the raw extracted data. It removes ads, scripts, and "junk" text from the chapter content, and formatting the navigation links.
- **`chapterScrapper.parser.ts`**: Running inside the browser context, this file selects the DOM elements and extracts their raw text/HTML content based on the config.
- **`chapterScrapper.ts`**: The generic orchestrator. It ties everything together: opens a page, waits for selectors, calls the parser, runs the normalizer, and returns the final object.

**Feature: Detail (`src/services/scrapper/sites/novlove/detail/`)**
- **`detailScrapper.config.ts`**: Selectors for the novel details page (title, author, synopsis, genres, chapter list).
- **`detailScrapper.model.ts`**: Interface definitions for the Novel Detail object (what the scrapper returns).
- **`detailScrapper.normalizer.ts`**: Formats the synopsis, cleans up genre tags, and structures the chapter list array.
- **`detailScrapper.parser.ts`**: Extracts raw strings for title, status, and related metadata from the DOM.
- **`detailScrapper.ts`**: The main function that performs the "Get Novel Details" job.

**Feature: Home (`src/services/scrapper/sites/novlove/home/`)**
- **`homeScrapper.config.ts`**: Selectors for the homepage banners, latest updates, and "hot" sections.
- **`homeScrapper.models.ts`**: Interfaces for the Homepage data structure.
- **`homeScrapper.normalizers.ts`**: Processes the list of novels found on the homepage, ensuring image URLs are valid and titles are trimmed.
- **`homeScrapper.parser.ts`**: Scrapes the lists of novels from the different homepage sections.
- **`homeScrapper.ts`**: The main function to scrape the homepage.

**Feature: List (`src/services/scrapper/sites/novlove/list/`)**
- **`listScrapper.config.ts`**: Selectors for search results or category listing pages.
- **`listScrapper.model.ts`**: Interfaces for the list items (search results).
- **`listScrapper.normalizer.ts`**: Cleans up the search result data (pagination info, novel summaries).
- **`listScrapper.parser.ts`**: Extracts the grid/list of novels from a search or category page.
- **`listScrapper.ts`**: The main function to scrape a list of novels based on query parameters (page number, genre, etc).

---

### **Utils (`src/utils/`)**
- **`redisCache.ts`**: A wrapper function for caching patterns. It takes a Redis key, a TTL, and a "fetcher" function. It tries to get data from Redis; if it fails, it runs the fetcher (scrapper), saves the result to Redis, and returns it.
- **`debugSnap.ts`**: debugging utilities for Puppeteer, such as taking screenshots when tests fail or when inspecting browser state.
