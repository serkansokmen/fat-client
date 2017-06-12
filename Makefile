build:
	docker-compose build

up:
	docker-compose up -d

start:
	docker-compose start

down:
	docker-compose down

makemigrations:
	docker-compose run web /usr/local/bin/python manage.py makemigrations

migrate:
	docker-compose run web /usr/local/bin/python manage.py migrate

migrate-fake:
	docker-compose run web /usr/local/bin/python manage.py migrate --fake-initial

schema:
	docker-compose run web /usr/local/bin/python manage.py graphql_schema

collectstatic:
	docker-compose run web /usr/local/bin/python manage.py collectstatic --noinput

clear_thumbnails:
	docker-compose run web /usr/local/bin/python manage.py thumbnail clear_delete_all

stop:
	docker-compose stop

shell-web:
	docker-compose run web bash

get_docker_ip:
	docker-machine ip dev

logs:
	docker-compose logs
