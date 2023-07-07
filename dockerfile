FROM alpine:3.18.2
RUN apk update && apk add nano git nodejs npm

RUN git clone https://github.com/Bissiking/nexus-agent.git /app
WORKDIR /app
RUN npm i

ENV token=

CMD ["bash" "index.js"]
