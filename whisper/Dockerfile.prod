FROM rust:slim-buster

RUN apt-get update && \
  apt-get -y upgrade && \
  apt-get -y install libssl-dev pkg-config && \
  apt-get install -y libclang-dev && \
  apt-get install -y cmake  && \
  apt-get install -y build-essential && \
  apt-get clean

WORKDIR /app
COPY ["Cargo.toml", "Cargo.lock", "/app/"]
COPY . /app/


RUN cargo build --release

EXPOSE 4001

ENTRYPOINT ["/bin/bash", "-c", "cargo run --release"]