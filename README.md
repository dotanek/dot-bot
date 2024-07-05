# dot-bot

Node/typescript application providing mostly entertainment features across different platforms I operate at.

#### Current features:
 - Basic twitch chat commands
 - Database access

## Setup

Requirements
- node v18.17.0
- npm v9.6.7
- docker 24.0.2

Install all dependencies

```bash
npm install
```

Set up environment variables by renaming `example.env` file to `.env` and modifying its values.

Run application
```bash
npm run start:dev
```
or for automatic redeploy after each code change 
```bash
npm run start:dev:nodemon
```

Set up database (requires docker) (optional for now)
```bash
docker-compose up -d database
```

### ToDo
- Application logs via dedicated logger class
- Add quote support in command arguments
