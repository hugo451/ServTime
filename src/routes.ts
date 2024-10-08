import { Router } from 'express';
import { UserClientController } from './entities/user/user-client/user-client.controller';
import { ServiceController } from './entities/service/service.controller';
import { CategoryController } from './entities/category/category.controller';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

const userClientController = new UserClientController();
router.get('/client', (req, res) => userClientController.getAll(req, res));
router.post('/client', (req, res) => userClientController.create(req, res));

const serviceController = new ServiceController();
router.get('/service', (req, res) => serviceController.getAll(req, res));
router.post('/service', (req, res) => serviceController.create(req, res));

const categoryController = new CategoryController();
router.get('/category', (req, res) => categoryController.getAll(req, res));
router.post('/category', (req, res) => categoryController.create(req, res));
router.get('/category/log', (req, res) =>
    categoryController.getRelatory(req, res),
);

export { router };
