# ===============================
# Config
# ===============================

COMPOSE=docker compose
API_CONTAINER=healthms_api
WEB_CONTAINER=healthms_web
MONGO_CONTAINER=healthms_mongo
REDIS_CONTAINER=healthms_redis

# ===============================
# Docker lifecycle
# ===============================

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) down -v
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

ps:
	$(COMPOSE) ps

# ===============================
# Logs
# ===============================

logs:
	$(COMPOSE) logs -f

logs-api:
	$(COMPOSE) logs -f api

logs-web:
	$(COMPOSE) logs -f web

# ===============================
# Shell access
# ===============================

api:
	docker exec -it $(API_CONTAINER) bash

web:
	docker exec -it $(WEB_CONTAINER) sh

mongo:
	docker exec -it $(MONGO_CONTAINER) mongosh

redis:
	docker exec -it $(REDIS_CONTAINER) redis-cli

# ===============================
# Useful commands
# ===============================

api-shell:
	docker exec -it $(API_CONTAINER) python

api-migrate:
	docker exec -it $(API_CONTAINER) alembic upgrade head

api-test:
	docker exec -it $(API_CONTAINER) pytest

clean:
	$(COMPOSE) down -v
	docker system prune -f
