FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder
WORKDIR /proj

COPY . .
RUN dotnet restore ./estudyRatings.csproj
RUN dotnet publish -c Release -o /proj/app

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app

COPY --from=builder /proj/app .

EXPOSE 8080

CMD ["dotnet", "estudyRatings.dll"]
