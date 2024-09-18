import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { userServices } from '../modules/user/user.service';
import catchAsync from '../utils/catchAsync';
import { checkPassword } from '../helpers/passwordHelper';
import { createToken } from './auth.utils';
import config from '../config';
import sendResponse from '../utils/sendResponse';

export const loginUser = catchAsync(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userInfo = await userServices.isUserExistIntoDB(email);
  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "user doesn't exist");
  }

  const isPasswordValid = checkPassword(password, userInfo.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'password does not match');
  }
  const tokenData = {
    email: userInfo.email,
    role: userInfo.role,
  };

  const token = createToken(
    tokenData,
    config.secret as string,
    config.expire_in as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user login successfully',
    data: {
      token,
      userInfo,
    },
  });
});
