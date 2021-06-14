# Search tool assignment

### build project

build containers `docker-compose up -d --build`

### start project
`docker-compose up -d`
### populate db
`docker exec -it SPA-search-tool_web_1 sh` \
and in the shell run:
`python populate_elastic.py`

### view web app
open http://127.0.0.1:5000/
