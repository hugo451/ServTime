# Padrões de projeto e seus objetivos em nosso projeto

Os seguintes padrões de projeto estão sendo utilizados em nosso projeto:

- **Singleton**: Utilizado para garantir que a classe tenha somente uma instância e forneça um ponto global de acesso a ela; padrão utilizado tanto nas classes `ServiceList`, `FileServiceRepository`, `UserClientList`, `FileUserClientRepository`, `CategoryList`, `FileCategoryRepository`, `FileLogRepository`, `LogList`, `HtmlLogService`, `PdfLogService`. Dessa forma, garantimos que não haverá mais de uma instância dessas classes.

- **Factory Method**: Utilizado para criar objetos sem especificar a classe exata do objeto que será criado; padrão utilizado nas classes `CategoryFactory`, `ServiceFactory`, `UserClientFactory`. Da forma que está implementado, podemos utilizar em alguma parte do código, por exemplo:
```java
const repositories = CategoryFactory.createRepositories();
const memoryRepo = repositories.memory;
const fileRepo = repositories.file;
```

De modo que não é necessário saber qual é a implementação de respositoriyes.memory e repositories.file.

- **Repository**: Utilizado para abstrair a lógica de acesso a dados, permitindo que a lógica de acesso seja independente da forma como os dados são armazenados e processados; está distribuído em várias classes, como `FileCategoryRepository`,
`CategoryList`,
`FileLogRepository`,
`LogList`,
`FileServiceRepository`,
`ServiceList`,
`FileUserClientRepository`,
`UserClientList`. Todas essas extendem a classe `Repository` e implementam os métodos `create`, `update`, `delete` e etc.


- **Controller**: Em nosso projeto utilizamos Controllers para organizar a entrada e saída de dados, de modo que invoquem os métodos necessários para a execução das funcionalidades do sistema, dada uma interação com usúario (por via de requisições http). Estão presentes nas classes `UserClientController`, , `ServiceController`, `CategoryController` e `FileController` que implementam `Controller`.

- **Adapter**: O padrão de projeto Adapter é utilizado para permitir que objetos com interfaces incompatíveis possam interagir entre si. Em nosso projeto, utilizamos o padrão Adapter para adaptar a interface de `Logs` tanto para PDF quanto para HTML, isso acontece nas classes `HtmlLogService` e `PdfLogService`.

- **Template Method**: Define o esqueleto de um algoritmo, deixando alguns passos para as subclasses implementarem. Em nosso projeto, definimos templates em várias classes, essas que são utilizados em praticamente todas as outras classes. Listando as classes que definimos templates: `Category`, `Log`, `Service`, `User`, `UserClient`, `Controller`, `Repository`, `Exception`, `LogService`, `Repository`, `createCommandTemplate`, `deleteCommandTemplate`, `getAllCommandTemplate`, `updateCommandTemplate` e outras.

- **Chain of Responsibility**: Utilizamos em nosso projeto para encadeadar objetos, de modo que a solicitação é passada ao longo da cadeia até que algum objeto a trate.  As classes ligadas a esse padrão são: `createCommandTemplate`, `deletCommandTemplate`, `getAllCommandTemplate`, `updateCommandTemplate`, `BaseHandler` e `EntityBuilder`.


- **Command**: Utilizamos o Command para encapsular uma solicitação como um objeto, permitindo que esta seja parametrizada. As classes ligadas a esse padrão são:  `getAllUserClientsCommand`, `DeleteUserClientCommand`, `CreateUserClientCommand`, `UpdateUserClientCommand`, `GetIdCategory`, `UpdateCategoryCommand`, `DeleteCategoryCommand`,`GetAllServicesCommand`, `UpdateServiceCommand`, `CreateServiceCommand`, `DeleterServiceCommand`, `createCommandTemplate`, `deleteCommandTemplate`, `getAllCommandTemplate`, `updateCommandTemplate`, `BaseHandler` e `EntityBuilder`.


- **Facade**: Em nosso projeto utilizamos o padrão Facade para fornecer uma interface simplificada e unificada para um conjunto de interfaces (Repositorys). A classe principal que implementa é a classe `Repository`.