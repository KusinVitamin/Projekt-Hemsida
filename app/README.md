```
                                      _____           _           _              _      
                                     |  __ \         (_)         | |       /\   | |     
                                     | |__) | __ ___  _  ___  ___| |_     /  \  | |     
                                     |  ___/ '__/ _ \| |/ _ \/ __| __|   / /\ \ | |     
                                     | |   | | | (_) | |  __/ (__| |_   / ____ \| |____ 
                                     |_|   |_|  \___/| |\___|\___|\__| /_/    \_\______|
                                                    _/ |                                
                                                   |__/                                 
```
# Project AL
![GitHub last commit](https://img.shields.io/github/last-commit/KusinVitamin/Projekt-Hemsida)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

## Getting started

### Prerequisites
1. [Node](https://nodejs.org/) (version 14 or greater) with [npm](https://www.npmjs.com/).
2. [MySQL server](https://www.mysql.com/).

### Installation
1. Use the package manager npm to install Project AL.
```sh
npm ci
```

2. Create a `.env` file at `/` and replace all occurrences of `<...>` with the appropriate values.
```ini
DB_host=<HOSTNAME>
DB_user=<USERNAME>
DB_password=<PASSWORD>
DB_database=<DATABASE-NAME>
```

3. Create database schema


## Usage
Use `npm` to launch the application with node.
```sh
npm start
```

### Start in development mode
Use `npm` to launch the application with nodemon.
```sh
npm run start:dev
```

## Folder Structure
```
.
├── public          # All public and static content
├── src             # Files used in node app
├── tests           # Unit tests
├── .env            # Enviroment variables
├── package.json
└── README.md
```