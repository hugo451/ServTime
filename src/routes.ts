import { Router } from "express";
import { UserClientController } from "./user/user-client/user-client.controller";
import { ServiceClientController } from "./service/service-client/service-client.controller";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.get('/client', (req, res) => new UserClientController().getAll(req, res));
router.post('/client', (req, res) => new UserClientController().create(req, res));

router.get('/service', (req, res) => new ServiceClientController().getAll(req, res));
router.post('/service', (req, res) => new ServiceClientController().create(req, res));

export { router };