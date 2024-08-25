import { Router } from "express";
import { UserClientController } from "./user/user-client/user-client.controller";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.get('/client', (req, res) => new UserClientController().getAll(req, res));
router.post('/client', (req, res) => new UserClientController().create(req, res));

export { router };