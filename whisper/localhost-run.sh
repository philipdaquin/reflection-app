
docker kill mongo-container-test
docker rm mongo-container-test


docker pull mongo:latest

docker run -d --name mongo-container-test --restart=always -p 27017:27017 -v mongodb_data_container:/data/db mongo:latest