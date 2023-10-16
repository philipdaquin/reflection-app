FROM rust:latest as build
# We use the latest Rust stable release as base image
FROM rust:1.59.0

# create a new empty shell project
RUN USER=root cargo new --bin whisper
WORKDIR /whisper

# copy over your manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

# this build step will cache your dependencies
# Let's switch our working directory to `app` (equivalent to `cd app`)
# The `app` folder will be created for us by Docker in case it does not 
# exist already.
WORKDIR /app
# Install the required system dependencies for our linking configuration
RUN apt update && apt install lld clang -y
# Copy all files from our working environment to our Docker image 
COPY . .
# Let's build our binary!
# We'll use the release profile to make it faaaast
RUN cargo build --release

# Copy the rest of the application code to the container
COPY src/ ./src/

# Build the application with release optimizations
RUN cargo build --release

# Expose port 8000 for the Actix server to listen on
EXPOSE 4001

# Start the Actix server when the container starts
CMD ["./target/release/whisper"]