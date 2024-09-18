import express from 'express';
import { serviceController } from './service.controller';
const router = express.Router();

router.post('/create-service', serviceController.crateService);
