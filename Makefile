run:
	docker-compose build
	docker-compose up -d
stop:
	docker-compose down
enter:
	docker-compose exec node /bin/bash
