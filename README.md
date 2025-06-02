To run this project:

1. Build the flask container:
```
    cd flask && docker build -t flask .
```

2. Launch docker-compose:
```
    docker-compose up
```

3. Install js dependencies and run the dev server
```
    cd react && npm install
    npm run dev
```

4. Open http://localhost:3000 to access the app.
