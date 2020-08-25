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
A aplicação é uma API Rest construída em cima da stack de ferramentas do Node.Js. Para persistir os dados ela utiliza o banco de dados MongoDB, um banco NoSQL que armazena dados de forma não estruturada.

Para facilitar os testes construí um ambiente de desenvolvimento utilizando Docker-Compose, este ambiente consiste de dois contêiners que hospedam o MongoDB e a API em Node.

Para rodar a aplicação basta rodar os seguintes comandos na raiz do projeto:
```bash
yarn install
make up
``` 
Esses comandos vão instalar as dependências do projeto, e rodar os comandos necessários para subir a aplicação. O "make up" gerará os seguintes comandos no terminal:

```bash
docker-compose -f docker-compose.yml up -d

docker exec db mongoimport --host db --username ${DB_USER} --password ${DB_PASS} --authenticationDatabase admin -d planets_api -c planets --type json --file /seed.json --jsonArray
```

O primeiro comando executa o arquivo docker-compose.yml e o segundo importa os valores iniciais que estão no arquivo seed.json

Exemplo de como a seed está estruturada:

```json
[
	{
		"_id": {
			"$oid": "5f42fd067ee9eb00564f9fcd"
		},
		"name": "Alderaan",
		"climate": "temperate",
		"terrain": "grasslands, mountains"
	},
	{
		"_id": {
			"$oid": "5f42fd0c7ee9eb00564f9fce"
		},
		"name": "Yavin IV",
		"climate": "temperate, tropical",
		"terrain": "jungle, rainforests"
	}
]
```

O make up não exibe o terminal de forma interativa, portanto apenas com esse comando não é possível ver os logs, para ver os logs o MakeFile também possui um comando, basta digitar no terminal
```bash
make logs
```
E os logs tanto do MongoDb quanto da API vão aparecer no terminal.

Para parar a execução da aplicação e do banco basta utilizar o comando
```bash
make down
```

#### `Utilizando a API`
Para utilizar a API qualquer programa que suporte o procolo HTTP pode ser utilizado. 
Abaixo podemos ver todos os verbos com um exemplo de requisição e as possíveis respostas que a API pode produzir.

<img src="https://i.imgur.com/wq1lM23.png">

A API também conta com um serviço de cache. Como o serviço externo da Swapi é um pouco lento, conseguimos reduzir os tempos de resposta cacheando os valores de retorno com um TTL de 1 mês.

A Api é de consulta, então nenhuma API Key, JWT ou qualquer outra forma de autenticação foi implementada.

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
Outros recursos foram utilizados para melhorar a experiência e a qualidade do desenvolvimento.

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
└── yarn.lock
```
---   
#####  `Considerações`
Apesar de terem poucas features a serem implementadas, o projeto foi um desafio e tanto. Tentei focar no valor e na qualidade do código, implementando ferramentas para melhorar desde a qualidade de escrita do código até convenção de commits.

Tive que resolver alguns problemas que não estou habituado a encontrar, por exemplo, testes automatizados e E2E. Foi muita pesquisa até conseguir chegar em quase todo o código com cobertura. 

O Javascript não é minha linguagem principal, mas em conjunto com o Node.js se mostrou muito bom para fazer o projeto.

Felizmente a comunidade é sensacional e todo esse conteúdo eu consegui achar pesquisando e pedindo dicas para amigos mais experientes. 

Todos os micro desafios encontrados durante o desenvolvimento deste projeto, definitivamente, me fizeram um programador melhor, me esticando em alguns assuntos que eu ainda não tinha domínio ou me apresentando assuntos novos.

#####  `Pontos de melhora`
Acredito que pelo tempo disponível o projeto ficou bem completo. No entanto, sempre há o que melhorar:

 - Utilizar TypeScript para tornar o projeto um pouco mais escalável e mais fortemente tipado
 - Refatorar alguns pontos para melhorar a legibilidade
 - Aplicar algum padrão de projeto para deixar o código mais extensível e reutilizável
 - Talvez mudar a arquitetura para uma arquitetura mais adequada
 - Loggar mais a aplicação
 - Implementar algum tipo de autenticação ou API Key
 - Utilizar orquestradores para os contêiners 
 - Fazer mais testes
