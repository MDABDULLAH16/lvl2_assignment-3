import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user.service';
import { createToken } from '../../Auth/auth.utils';
import config from '../../config';

const createUser = catchAsync(async (req, res) => {
  const { email, role } = req.body;
  const result = await userServices.createUserIntoDB(req.body);

  const tokenData = {
    email: email,
    role: role,
  };
  const token = createToken(
    tokenData,
    config.secret as string,
    config.expire_in as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',

    data: { token, result },
  });
});

export const UserControllers = {
  createUser,
};
