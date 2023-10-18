

docker kill whisper-service
docker rm whisper-service

# Build 
cargo build --release

# # Test 
cargo test

# Package 
cargo build --release

# Docker build image
docker build -t whisper-service .

docker tag whisper-service philipasd/whisper-service:0.0.0

# docker push philipasd/whisper-service:v0.0.0

# Run the whisper container
# docker run --name whisper-service -d -t --link postgres-db:postgres -p 7000:7000 whisper-service