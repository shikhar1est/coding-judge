FROM gcc:latest
WORKDIR /app
COPY . .
RUN g++ -o program code.cpp
CMD ["/bin/sh", "-c", "./program < input.txt"]
