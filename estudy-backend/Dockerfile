FROM openjdk:17
LABEL authors="fijizxli"
MAINTAINER fijizxli

COPY target/estudy-backend-0.0.1.jar app.jar
ENV DB_USER=zolu
ENV DB_PASSWORD=kN8zXjH7xL9iLP0NdoHpSNYKuW6TKf1CGXRqLXZrI9aIn3kcnE

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
