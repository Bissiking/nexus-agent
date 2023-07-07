FROM alpine:latest
WORKDIR /app

RUN apk update && apk add nano git nodejs npm
RUN git clone https://github.com/Bissiking/nexus-agent.git /app
RUN npm i

ENV token=
CMD ["bash" "index.js"]
