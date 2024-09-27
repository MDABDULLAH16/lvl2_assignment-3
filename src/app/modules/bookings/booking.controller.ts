import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const { user } = req; // Assuming user is added to req from authentication middleware
  if (!user) {
    throw new Error('User not authenticated');
  }
  console.log('userC', user.email);

  const serviceDetails = req.body;

  // Call the booking service to handle booking logic
  const booking = await BookingServices.createBooking(
    user.email,
    serviceDetails
  );

  // Send the successful booking response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking successful',
    data: booking,
  });
});

export const BookingsController = {
  createBooking,
};
