# MapsMap Prototype - Backend

### Requirements

- Node v12 LTS

### Installation

```
git clone https://github.com/Lemii/mapsmap
cd ./mapsmap/backend
npm i
```

### Usage

#### Start Node

```
npm start
```

### WebSocket API

[ws://localhost:8080/ws](ws://localhost:8080/ws)

### REST API

[http://localhost:4444](http://localhost:4444)

### API Endpoints

#### Account

```
/api/accounts/{address}
```

#### Problems

```
/api/problem/{problemId}
/api/problems
/api/problems/open
/api/problems/solved
/api/problems/owner/{address}

```

#### Solutions

```

/api/solution/{solutionId}
/api/solutions
/api/solutions/owner/{address}
/api/solutions/problem/{problemId}

```

## License

[Apache License, Version 2.0](../LICENSE)
