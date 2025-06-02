# 10Beauty Interview Assignment

## Running the project

To run this project:

1. Build the flask container:
```
    cd flask && docker build -t flask .
```

2. Launch docker-compose:
```
    cd ../ && docker-compose up
```

3. Install js dependencies and run the dev server
```
    cd react && npm install
    npm run dev
```

4. Open http://localhost:3000 to access the app.

Note that a Postman collection is available for testing API requests.

## Design considerations for this project
For the initial pass of this project, I decided to simply take each todo item from postgres and convert it into JSON to store in Redis on creation. This solution does have some downsides, introducing JSON parsing/dumping overhead, and I would definitely rework it if spending more time on the project. I also decided to keep a JSON string representing *all* todo items in Redis, and then invalidate it when any object changed. A better solution here might be to keep a list of valid todo items in Redis and then use that to fetch each valid item individually. This would allow updating individual items without needing to invalidate the main cache. However, this change would mean making many more redis calls, basically N+1 for N todo items.
