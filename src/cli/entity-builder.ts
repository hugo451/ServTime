import { BaseHandler } from "./handlers/base.handler";
import { ControllerHandler } from "./handlers/controller.handler";
import { DirectoriesHandler } from "./handlers/directories.handler";
import { DtoHandler } from "./handlers/dto.handler";
import { EntityHandler } from "./handlers/entity.handler";
import { CreateExceptionHandler } from "./handlers/exceptions/create-exceptions.handler";
import { FactoryHandler } from "./handlers/repositories/factory.handler";
import { RepositoryHandler } from "./handlers/repositories/repository,handler";

export class EntityBuilder {
  private firstHandler: BaseHandler;

  constructor() {
    const directoriesHandler = new DirectoriesHandler();
    const controllerHandler = new ControllerHandler();
    const entityHandler = new EntityHandler();
    const dtoHandler = new DtoHandler();
    const exceptionsHandler = new CreateExceptionHandler();
    const repositoriesHandler = new RepositoryHandler();
    const factoryHandler = new FactoryHandler();

    // Configura a cadeia
    directoriesHandler
      .setNext(entityHandler)
      .setNext(factoryHandler)
      .setNext(repositoriesHandler)
      .setNext(controllerHandler)
      .setNext(dtoHandler)
      .setNext(exceptionsHandler);

    this.firstHandler = directoriesHandler;
  }

  public async create(command: string, entityName: string): Promise<void> {
    await this.firstHandler.handle(command, entityName);
  }
}
