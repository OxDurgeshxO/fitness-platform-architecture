.PHONY: all install build test lint typecheck dev docker-up docker-down db-migrate seed clean help

SHELL := /bin/bash

help: ## Display available commands
	@echo "AI Biomechanical Fitness Platform - Developer Commands"
	@echo "--------------------------------------------------------"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install all monorepo dependencies
	pnpm install

build: ## Build all packages and applications
	pnpm -r build

typecheck: ## Run TypeScript typecheck across all workspaces
	pnpm -r typecheck

test: ## Run unit and integration tests
	pnpm test

lint: ## Run linter across packages
	pnpm -r lint

dev: ## Start local development environment
	pnpm dev

docker-up: ## Start background database and Redis containers
	docker compose up -d postgres redis

docker-down: ## Stop all docker containers
	docker compose down

db-migrate: ## Run database migrations
	pnpm --filter @fitness/db migrate

seed: ## Seed database with initial exercise catalog and test user
	pnpm --filter @fitness/db seed

clean: ## Remove build artifacts and caches
	rm -rf dist **/dist .next **/node_modules/.cache
