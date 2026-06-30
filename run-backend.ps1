# Helper script to run the LOCAL VOICE backend
# Overrides JAVA_HOME to use Java 21 and runs the application using the local Maven package.

$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.3.9-hotspot"
Write-Host "Starting LOCAL VOICE Backend..." -ForegroundColor Green
Write-Host "Using Java Home: $env:JAVA_HOME" -ForegroundColor Cyan

cd backend
..\.tools\apache-maven-3.9.8\bin\mvn.cmd spring-boot:run
