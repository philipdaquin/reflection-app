# # FROM messense/rust-musl-cross:x86_64-musl as chef
# # ENV SQLX_OFFLINE=true

# # RUN apt-get update && \
# #   apt-get -y upgrade && \
# #   apt-get -y install libssl-dev pkg-config && \
# #   apt-get install -y libclang-dev && \
# #   apt-get install -y cmake  && \
# #   apt-get install -y build-essential && \
# #   apt-get install -y musl-tools && \
# #   apt-get clean

# # # Set environment variables for OpenSSL
# # # ENV OPENSSL_DIR=/usr/lib/x86_64-linux-gnu
# # # ENV OPENSSL_INCLUDE_DIR=/usr/include


# # RUN cargo install cargo-chef
# # WORKDIR /api-deployment-example

# # FROM chef AS planner
# # # Copy source code from previous stage
# # COPY . .
# # # Generate info for caching dependencies
# # RUN cargo chef prepare --recipe-path recipe.json

# # FROM chef AS builder
# # COPY --from=planner /api-deployment-example/recipe.json recipe.json

# # RUN apt-get update && \
# #   apt-get -y upgrade && \
# #   apt-get -y install pkg-config && \
# #   apt-get -y install libssl-dev  && \
# #   apt-get install -y libclang-dev && \
# #   apt-get install -y cmake  && \
# #   apt-get install -y build-essential && \
# #   apt-get install -y musl-tools && \
# #   apt-get clean
# # # Set environment variables for OpenSSL
# # # ENV OPENSSL_DIR=/usr/lib/x86_64-linux-gnu
# # # ENV OPENSSL_INCLUDE_DIR=/usr/include

# # # Build & cache dependencies
# # RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
# # # Copy source code from previous stage
# # COPY . .
# # # Build application
# # RUN cargo build --release --target x86_64-unknown-linux-musl

# # # Create a new stage with a minimal image
# # FROM scratch
# # COPY --from=builder /api-deployment-example/target/x86_64-unknown-linux-musl/release/api-deployment-example /api-deployment-example
# # ENTRYPOINT ["/api-deployment-example"]
# # EXPOSE 4001


# FROM lukemathwalker/cargo-chef:latest-rust-1.70.0-alpine3.18 as chef
# WORKDIR app

# FROM chef AS planner
# COPY . .
# # RUN apt-get update && \
# #   apt-get -y upgrade && \
# #   apt-get -y install pkg-config && \
# #   apt-get -y install libssl-dev  && \
# #   apt-get install -y libclang-dev && \
# #   apt-get install -y cmake  && \
# #   apt-get install -y build-essential && \
# #   apt-get clean

# RUN cargo chef prepare --recipe-path recipe.json

# FROM chef AS builder

# RUN apt-get update && \
#   apt-get -y upgrade && \
#   apt-get -y install pkg-config && \
#   apt-get -y install libssl-dev  && \
#   apt-get install -y libclang-dev && \
#   apt-get install -y cmake  && \
#   apt-get install -y build-essential && \
#   apt-get clean

# COPY --from=planner /app/recipe.json recipe.json
# RUN cargo chef cook --release --recipe-path recipe.json
# COPY . .
# RUN cargo build --release

# FROM scratch
# COPY --from=builder /app/target/release/hello /
# CMD ["./hello"]


FROM lukemathwalker/cargo-chef:latest-rust-1.72.0 as chef
WORKDIR /app
RUN apt-get update && \
  apt-get -y upgrade && \
  apt-get -y install pkg-config && \
  apt-get -y install libssl-dev  && \
  apt-get install -y libclang-dev && \
  apt-get install -y cmake  && \
  apt-get install -y build-essential && \
  apt-get clean
FROM chef as planner
COPY . .
COPY models /app/models/

# Compute a lock-like file for our project
RUN cargo chef prepare  --recipe-path recipe.json
FROM chef as builder
COPY --from=planner /app/recipe.json recipe.json
# Build our project dependencies, not our application!
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
COPY models /app/models

# ENV SQLX_OFFLINE true
# Build our project
RUN cargo build --release --bin whisper
FROM debian:bookworm-slim AS runtime

WORKDIR /app
COPY models /app/models
# COPY . . 
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates pkg-config libssl-dev libclang-dev cmake build-essential \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/whisper whisper
# COPY configuration configuration
# ENV APP_ENVIRONMENT production
EXPOSE 4001
ENTRYPOINT ["./whisper"]
















# FROM rust:slim-buster

# RUN apt-get update && \
#   apt-get -y upgrade && \
#   apt-get -y install libssl-dev pkg-config && \
#   apt-get install -y libclang-dev && \
#   apt-get install -y cmake  && \
#   apt-get install -y build-essential && \
#   apt-get clean

# WORKDIR /app
# COPY ["Cargo.toml", "Cargo.lock", "/app/"]
# COPY . /app/


# RUN cargo build --release

# EXPOSE 4001

# ENTRYPOINT ["/bin/bash", "-c", "cargo run --release"]