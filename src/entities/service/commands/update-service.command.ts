
        import { Command } from '../../../command';
        import { Service } from '../service';
        import { ServiceList } from '../repositories/in-memory-service.repository';
        import { FileServiceRepository } from '../repositories/file-service.repository';
        import { ServiceCreateException, ServiceCreateErrorCode } from '../exceptions/service-create.exception';

        export class UpdateServiceCommand implements Command<Service, Service> {
            private memoryRepository: ServiceList;
            private fileRepository: FileServiceRepository;

            constructor(memoryRepository: ServiceList, fileRepository: FileServiceRepository) {
                this.memoryRepository = memoryRepository;
                this.fileRepository = fileRepository;
            }

            async execute(service: Service): Promise<Service> {
                try {
                    return this.fileRepository.update(service.id, service);
                } catch (error) {
                    if (error instanceof ServiceCreateException) {
                        throw error;
                    }
                    throw new ServiceCreateException(
                        'Failed to update service.',
                        ServiceCreateErrorCode.UPDATE_FAILED,
                    );
                }
            }
        }
        