#!/bin/bash

cd spring-boot || exit
mvn clean package -DskipTests
java -jar target/spring-boot-*.jar > backend.log

until curl -s http://localhost:8080/api/swagger-ui/index.html#/ | grep -q '"status":"UP"'; do
  sleep 10
done

# Aller dans le dossier du frontend
cd ../react-app || exit

npm install
npx @openapitools/openapi-generator-cli generate -i http://localhost:8080/api/v3/api-docs -g typescript-fetch -o ./src/generated
npm run dev &
