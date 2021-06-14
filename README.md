# Search tool assignment

### build project

build containers `docker-compose up -d --build`

### start project
`docker-compose up -d`
### populate db
wait a few minutes for elastic to start, can check at http://localhost:5601. than run:
`docker exec -it spa-search-tool_web_1 sh` \
drops you a shell inside the running container, than in the shell run:
`python populate_elastic.py`

### view web app
open http://127.0.0.1:5000/
