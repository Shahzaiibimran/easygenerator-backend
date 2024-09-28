import { HttpStatus } from '@nestjs/common';

export const sendResponse = (statusCode: number, errors?: object, data?: any) => {
  return {
    statusCode,
    message: HttpStatus[statusCode],
    data: data || {},
    errors: errors || []
  };
};