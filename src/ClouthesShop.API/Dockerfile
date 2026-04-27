# ── Build Stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for layer caching
COPY ["src/ClouthesShop.Domain/ClouthesShop.Domain.csproj", "src/ClouthesShop.Domain/"]
COPY ["src/ClouthesShop.Application/ClouthesShop.Application.csproj", "src/ClouthesShop.Application/"]
COPY ["src/ClouthesShop.Infrastructure/ClouthesShop.Infrastructure.csproj", "src/ClouthesShop.Infrastructure/"]
COPY ["src/ClouthesShop.API/ClouthesShop.API.csproj", "src/ClouthesShop.API/"]

RUN dotnet restore "src/ClouthesShop.API/ClouthesShop.API.csproj"

# Copy all source code
COPY . .

WORKDIR "/src/src/ClouthesShop.API"
RUN dotnet build "ClouthesShop.API.csproj" -c Release -o /app/build

# ── Publish Stage ────────────────────────────────────────────────────────────
FROM build AS publish
RUN dotnet publish "ClouthesShop.API.csproj" -c Release -o /app/publish \
    /p:UseAppHost=false \
    /p:GenerateDocumentationFile=true

# ── Runtime Stage ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE 8080
EXPOSE 8081

ENV ASPNETCORE_ENVIRONMENT=Docker
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "ClouthesShop.API.dll"]
