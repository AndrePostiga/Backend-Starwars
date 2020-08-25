include .env

.PHONY: up

up:
	docker-compose -f docker-compose.yml up -d
	docker exec db mongoimport --host ${DB_HOST} --username ${DB_USER} --password ${DB_PASS} --authenticationDatabase admin -d ${DB_NAME} -c planets --type json --file /seed.json --jsonArray

.PHONY: down

down:
	docker-compose down

.PHONY: logs

logs:
	docker-compose logs -f

.PHONY: tests

tests:
	docker-compose -f docker-compose-test.yml up -d
	docker exec db mongoimport --host ${DB_HOST} --username ${DB_USER} --password ${DB_PASS} --authenticationDatabase admin -d ${DB_NAME} -c planets --type json --file /seed.json --jsonArray
	DB_HOST=localhost yarn test
	docker-compose -f docker-compose-test.yml down

.PHONY: testsCi

testsCi:
	docker-compose -f docker-compose-test.yml up -d
	docker exec db mongoimport --host ${DB_HOST} --username ${DB_USER} --password ${DB_PASS} --authenticationDatabase admin -d ${DB_NAME} -c planets --type json --file /seed.json --jsonArray
	DB_HOST=localhost yarn test:ci
	docker-compose -f docker-compose-test.yml down
