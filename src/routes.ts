import { Router } from "express";
import { CreateClientController } from "./controllers/user/create-user-client";
import { GetClientController } from "./controllers/user/get-user-client";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.get('/client', new GetClientController().handle);
router.post('/client', new CreateClientController().handle);

export { router };