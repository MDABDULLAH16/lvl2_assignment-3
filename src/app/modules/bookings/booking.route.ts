import express from 'express';
import { BookingsController } from './booking.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import authenticateUser from '../../middlewares/userVerify';

const router = express.Router();

// router.post('/slots', slotController.createSlotReq);
router.post(
  '/',
  authenticateUser,
  auth(USER_ROLE.user),
  BookingsController.createBooking
);
// router.get('/availability', slotController.getAvailableSlot2);

export const BookingsRoute = router;
