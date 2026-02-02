up:
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down --rmi local

fclean:
	docker compose down --rmi local --volumes
	rm -rf backend/node_modules backend/dist


.PHONY: up down clean fclean