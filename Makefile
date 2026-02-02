up:
	docker compose up --build

migrate:
	docker compose exec backend npm run migrate

psql:
	docker compose exec db psql -U postgres -d ${POSTGRES_DB}

down:
	docker compose down

clean:
	docker compose down --rmi local

fclean:
	docker compose down --rmi local --volumes
	rm -rf backend/node_modules backend/dist


.PHONY: up down clean fclean migrate