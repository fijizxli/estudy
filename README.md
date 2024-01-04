# Estudy
Online studying platform.

# TODO :
- [ ] write tests
- [ ] fix css / use tailwind / bootstrap
- [ ] switch from basic auth to jwt
- [ ] search, filtering
- [ ] add images to courses
- [ ] user profile page

## Frontend: react js

### install dependencies:
``` sh
npm install
```

### run (in dev):
``` sh
npm start
```

### production build & run:
``` sh
npm run build
npx serve -s build
```

## DB: MySQL
Set the database connection settings in application.properties
or you can use environment variables ($DB_USER, $DB_PASSWORD).

The default name of the database is estudy but it can be easily changed in application.properties.

I might use environment variables for more database settings in the future.

## Backend: Spring (java 17)

``` sh
DB_USER=user DB_PASSWORD=password ./mvnw spring-boot:run
```