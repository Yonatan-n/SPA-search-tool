# Reposify search tool assignment

## build project

docker-compose up -d --build

start project
docker-compose up -d

open http://127.0.0.1:5000/

the front-end will trigger the populate_elasitc script on the first load, using /populate-elastic route. \
it can be executed manually as well, run code`python populate_elastic.py` inside the container
