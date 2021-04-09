.PHONY: redis
redis:
	docker-compose -f docker-compose-redis.yml up -d

.PHONY: kafka
kafka:
	docker-compose -f docker-compose-kafka.yml up -d

.PHONY: mysql
mysql:
	docker-compose -f docker-compose-mysql.yml up -d

.PHONY: pg
pg:
	docker-compose -f docker-compose-pg.yml up -d

.PHONY: cassandra
cassandra:
	docker-compose -f docker-compose-cassandra.yml up -d
