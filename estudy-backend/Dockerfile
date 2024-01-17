FROM docker.io/openjdk:17

LABEL authors="fijizxli"
MAINTAINER fijizxli

ARG DB_USER
ARG DB_PASSWORD

COPY target/estudy-backend-latest-pod.jar app.jar
ENV DB_USER=DB_USER
ENV DB_PASSWORD=DB_PASSWORD

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
