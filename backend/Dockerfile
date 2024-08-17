# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /source

# Copy everything to the container
COPY . .

# Restore dependencies
RUN dotnet restore "./backend/backend.csproj" --disable-parallel

# Install dotnet-ef tool
RUN dotnet tool install --global dotnet-ef --version 6.0.31
ENV PATH="${PATH}:/root/.dotnet/tools"

# Publish the application
RUN dotnet publish "./backend/backend.csproj" -c release -o /app --no-restore

# Migrations Stage
FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS migrations
WORKDIR /app

# Copy the published application
COPY --from=build /app ./
COPY . .

# Run the database update
RUN dotnet ef migrations add AddNewFields --project /source/backend
RUN dotnet ef database update --project /source/backend

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal
WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app ./

COPY ./backend/v4.dll /app/v4.dll

# Expose the port
EXPOSE 5000 4002

# Run the application
ENTRYPOINT ["dotnet", "backend.dll"]
