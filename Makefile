all: create_dev_db start_dev_db docker_build_backend docker_run_backend

docker_build_backend:
	docker build -t culero-api -f ./backend/Dockerfile .

docker_run_backend:
	docker run --network host --env-file ./backend/.env --rm culero-api

create_dev_db:
	docker run --name culero-psql --network host -e POSTGRES_PASSWORD=password -d postgres

start_dev_db:
	docker start culero-psql
	
stop_dev_db:
	docker stop culero-psql