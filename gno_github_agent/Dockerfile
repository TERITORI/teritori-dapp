# Start from the latest golang base image
FROM golang:1.23-bullseye

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy everything from the current directory to the Working Directory inside the container
COPY . .

ENV CGO_ENABLED=1
RUN --mount=type=cache,target=/root/.cache/go-build --mount=type=cache,target=/go go build -o bin/main main.go

CMD [ "/app/bin/main" ]

