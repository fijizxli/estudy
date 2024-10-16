FROM maven:3.9.6-eclipse-temurin-21 as build
WORKDIR /proj

COPY . .
RUN ["mvn", "clean", "package"]

FROM eclipse-temurin:21-alpine
WORKDIR /app
COPY --from=build /proj/target/estudy-backend-latest-pod.jar app.jar

EXPOSE 8080

CMD ["java","-jar","./app.jar"]
