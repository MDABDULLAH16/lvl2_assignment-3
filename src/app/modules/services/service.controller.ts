import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { serviceServices } from './service.service';

const crateService = catchAsync(async (req, res) => {
  const service = req.body;
  const result = await serviceServices.createServiceIntoDB(service);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'service create Successfully',
    data: result,
  });
});

export const serviceController = {
  crateService,
};
