## This is a repository with SIMPLE CRUD API

.env.development consists of env variables (mostly BE resources) which can be used during development process.

### Requirements:  

- Node.js version 20

### Installation: 

1. Cloning repo with:

```console
git clone https://github.com/Katerina-Kor/crud-api-nodejs.git
```

2. Go to the folder

```console
cd crud-api-nodejs
```

3. Switch to `develop` branch

```console
git checkout develop
```

4. Install dependencies running

```console
npm install
```

5. Start the server

```console
npm run start:dev
```

### Scripts definition

- Install dependencies

```console
npm i
```

- Run in development mode

```console
npm run start:dev
```

- Run in production mode

```console
npm run start:prod
```

- Start API with horizontal scaling and load balancer

```console
npm run start:multi
```

- Unit tests execution

```console
npm run test
```
### API description

1. Implemented endpoint `api/users`:
    - **GET** `api/users` is used to get all persons
        - Server will answer with `status code` **200** and all users records
    - **GET** `api/users/{userId}` 
        - Server will answer with `status code` **200** and record with `id === userId` if it exists
        - Server will answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server will answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **POST** `api/users` is used to create record about new user and store it in database
        - Server will answer with `status code` **201** and newly created record
        - Server will answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    - **PUT** `api/users/{userId}` is used to update existing user
        - Server will answer with` status code` **200** and updated record
        - Server will answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server will answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
        - Server will answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
        - Server will answer with `status code` **204** if the record is found and deleted
        - Server will answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server will answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
2. Users are stored as `objects` that have following properties:
    - `id` — unique identifier (`string`, `uuid`) generated on server side
    - `username` — user's name (`string`, **required**)
    - `age` — user's age (`number`, **required**)
    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
3. Server will answer with `status code` **404** and corresponding human-friendly message to requests to non-existing endpoints (e.g. `some-non/existing/resource`)
4. Server will answer with `status code` **500** and corresponding human-friendly message if errors on the server side will occur during the processing of a request