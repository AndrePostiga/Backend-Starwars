#`Backend - Star Wars (Node.js)`
------------------------------

### `Objetivo`
Desenvolver uma API Rest utilizando Node.js, persistindo os dados utilizando um banco NoSql.

#### `Requisitos`
Dada a seguinte entidade

<img src="https://i.imgur.com/LXduNQN.png">

 - [x] Criar, Listar todos, Listar por ID ou nome, Deletar por ID ou nome
 - [x] Os dados iniciais devem ser inseridos manualmente
 - [x] Retornar junto aos dados a quantidade de aparições em filmes

### `A Api e como utilizar`
<<<<<<< HEAD
A aplicação é uma API Rest contruída em cima da stack de ferramentas do Node.Js. Para persistir os dados ela utiliza o banco de dados MongoDB, um banco NoSQL que armazena dados de forma não estruturada.
=======
>>>>>>> e96df64afaea6c113442ec208424abcef70dde51

#### `Arquitetura`
A arquitetura da aplicação foi inspirada na arquitetura em camadas e escolhida de forma que deixasse o projeto extensível e fácil de adicionar novos modelos e endpoints.
<img src="https://i.imgur.com/dKeuy6Y.png">

Para adicionar uma nova entidade basta adicionar suas devidas camadas na arquitetura desenhada acima, de forma que as regras de negócio fiquem desacopladas do resto do código.

#### `Testes`
A biblioteca de testes escolhida foi o Jest para testes unitários e Supertest para testes E2E. Nele podemos organizar os testes em suites de testes e ter um relatório de coverage que mostra quais partes do código foram testadas e estão cobertas e quais não estão.

Para rodar os testes da aplicação basta rodar o seguinte comando:

```bash
make tests
`````
Ou para testes e testes e2e
```bash
make testsCi
`````

Esses comandos vão gerar os seguintes comandos (lembrando que as variáveis de ambiente são importadas junto com o Makefile):
#### `tests`
```bash
docker-compose -f docker-compose-test.yml up -d

docker exec db mongoimport --host db --username ${DB_USER} --password ${DB_PASS} --authenticationDatabase admin -d planets_api -c planets --type json --file /seed.json --jsonArray

DB_HOST=localhost yarn test

docker-compose -f docker-compose-test.yml down
`````
#### `testsCi`
```bash
docker-compose -f docker-compose-test.yml up -d

docker exec db mongoimport --host db --username ${DB_USER} --password ${DB_PASS} --authenticationDatabase admin -d planets_api -c planets --type json --file /seed.json --jsonArray

DB_HOST=localhost yarn test:ci

docker-compose -f docker-compose-test.yml down
`````

Ao rodar o testsCi o Jest gera um relatório de cobertura que está dentro da pasta Coverage deste repositório, também pode ser visualizada abaixo:
<img src="https://i.imgur.com/45FHkbQ.png">

#### `As Ferramentas`
<<<<<<< HEAD
Os seguintes recursos foram utilizados para melhorar a experiência e a qualidade do desenvolvimento.
=======
A aplicação é uma API Rest contruída em cima da stack de ferramentas do Node.Js. Para persistir os dados ela utiliza o banco de dados MongoDB, um banco NoSQL que armazena dados de forma não estruturada.

Outros recursos foram utilizados para melhorar a experiência e a qualidade do desenvolvimento.
>>>>>>> e96df64afaea6c113442ec208424abcef70dde51

 - ###### `Nodemon + Sucrase`
Utilizado para monitorar a mudança de estado dos arquivos e transpilar o código escrito em ES6 para CommonJs. Essa combinação permite utilizar as últimas features da linguagem que ainda não são suportadas nativamente pelo node, como a sintax Import/Export.
 - ###### `Jest e Supertest 9para testes`
O Jest foi utilizado para realizar os testes unitários. Também o utilizei em conjunto com o Supertest para realizar os testes E2E.
 - ###### `Docker-Compose`
O docker compose foi utilizado para montar todo o ambiente de execução da aplicação. Ele sobe o MongoDB e a API em dois containers separados e ambos possuem variáveis de ambiente já configuradas, volumes e dependências.
 - ###### `MakeFile`
Utilizado em conjunto com o docker-compose, ele permite rodar um conjunto de comandos shell com apenas um comando. Também permite importar as variáveis de ambiente para passar para os comandos.
 - ###### `Eslint + Prettier`
Verifica a sintaxe em tempo de desenvolvimento melhorando a experiência de desenvolvimento e mantendo os padrões definidos pela [Airbnb StyleGuide](https://github.com/airbnb/javascript), é utilizado junto ao Prettier para uma melhora mais completa.
 - ###### `Git commit msg linter`
Verifica o texto do commit para manter o padrão do [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).
 - ###### `Husky + LintStaged`
O Husky foi utilizado para automatizar algumas tarefas no pré commit. Por padrão, antes de commitar, o Husky vai rodar ESlint para checar a sintaxe e o jest para garantir que todos os testes estão passando. Para rodar essa verificação só nos arquivos que estão na fase 'staged' e reduzir a espera do pré commit, eu o utilizo junto ao Lint-Staged.

#### `Todas as configs relacionadas as libs mencionadas anteriormente podem ser vistas neste repositório `

 - #### `Estrutura de pastas`
```
Backend-Starwars/
├── Makefile
├── README.md
├── docker-compose-test.yml
├── docker-compose.yml
├── jest.config.js
├── jsconfig.json
├── nodemon.json
├── package.json
├── seed.json
├── src
│   ├── E2E
│   │   ├── api.E2E.test.js
│   │   └── mockExternalServices.js
│   ├── app
│   │   ├── controllers
│   │   │   └── planetController.js
│   │   ├── domain
│   │   │   └── planet.js
│   │   ├── errors
│   │   │   ├── badRequest.js
│   │   │   ├── conflict.js
│   │   │   ├── index.js
│   │   │   ├── notFoundError.js
│   │   │   └── serverError.js
│   │   ├── model
│   │   │   └── planetModel.js
│   │   ├── repository
│   │   │   ├── index.js
│   │   │   ├── moviesRepository.js
│   │   │   ├── moviesRepository.spec.js
│   │   │   ├── planetRepository.js
│   │   │   └── planetRepository.spec.js
│   │   ├── service
│   │   │   ├── MovieServices
│   │   │   │   ├── findMovieService.js
│   │   │   │   ├── findMovieService.spec.js
│   │   │   │   └── index.js
│   │   │   └── PlanetServices
│   │   │       ├── createPlanetService.js
│   │   │       ├── findPlanetService.js
│   │   │       ├── index.js
│   │   │       ├── planetService.spec.js
│   │   │       └── removePlanetService.js
│   │   └── utils
│   │       └── http.js
│   ├── app.js
│   ├── database
│   │   └── index.js
│   ├── routes.js
│   └── server.js
├── tree.txt
└── yarn.lock
```
---
#####  `Considerações`


#####  `Pontos de melhora`
