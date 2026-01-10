# 1. Start with the .NET SDK (the "Kitchen" where we cook the code)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 2. Copy the project file and "Restore" (downloading Nuget packages)
COPY *.csproj ./
RUN dotnet restore

# 3. Copy everything else and "Publish" (compiling the code for production)
COPY . ./
RUN dotnet publish -c Release -o /out

# 4. Switch to the Runtime (the "Plate" where we serve the food - much smaller/lighter)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Tell Docker our app runs on port 8080 internally
EXPOSE 8080

# Start the app
ENTRYPOINT ["dotnet", "Tetherfi.Identity.Service.dll"]