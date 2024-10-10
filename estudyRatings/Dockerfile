FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder
WORKDIR /proj

ARG MONGO_USER
ARG MONGO_PASSWORD
ARG MONGO_HOST
ARG MONGO_PORT
ARG MONGO_DB

COPY . .
RUN dotnet restore ./estudyRatings.csproj
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=builder /proj/app .

EXPOSE 5065
RUN ls -Rahl .

#ENTRYPOINT ["dotnet", "estudyRatings.dll"]
CMD ["dotnet", "/app/publish/estudyRatings.dll"]
#CMD ["sleep", "3600"]