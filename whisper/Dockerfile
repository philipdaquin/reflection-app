FROM rust:1.59

# Set the working directory to /app
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files to the container
COPY Cargo.toml Cargo.lock ./

# Build the dependencies to cache them
RUN cargo build --release

# Copy the rest of the application code to the container
COPY src/ ./src/

# Build the application with release optimizations
RUN cargo build --release

# Expose port 8000 for the Actix server to listen on
EXPOSE 4001

# Start the Actix server when the container starts
CMD ["./target/release/whisper"]