import { Router } from "express";
import { CreateClientController } from "./controllers/user/create-user-client";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.post('/client', new CreateClientController().handle);

export { router };