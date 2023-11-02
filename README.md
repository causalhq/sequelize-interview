<p align="center"><img src="logo.svg" width="100" alt="Sequelize logo" /></p>
<h1 align="center" style="margin-top: 0;"><a href="https://sequelize.org">Sequelize</a></h1>

# Causal Interview Test

Based on https://github.com/sequelize/sequelize

Make sure to complete the entire setup process below, and can run the final test command

## Recommended Dependencies

```
node -v
v18.16.0
```

```
yarn -v
3.6.1
```

```
docker -v
Docker version 20.10.14, build a224086
```

## Setup

- `yarn install`
- `yarn lerna run build`
- start docker
- `yarn start-postgres-latest` this might print an error but as long as the docker container is running everything else will work (check with `docker ps`)

## Run

- `yarn lerna run test-postgres`
