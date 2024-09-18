import { TService } from './service.interface';
import { Service } from './service.model';

const createServiceIntoDB = async (payload: TService) => {
  const result = Service.create(payload);
  return result;
};

export const serviceServices = {
  createServiceIntoDB,
};
