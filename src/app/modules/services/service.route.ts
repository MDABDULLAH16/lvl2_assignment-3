import express from 'express';
import { serviceController } from './service.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.admin), serviceController.crateService);

export const ServiceRoute = router;
