import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionsFilter } from '../httpExceptions.filter';
import { ArgumentsHost } from '@nestjs/common';
import { HttpException } from '../httpException';
import { Response } from 'express';

describe('HttpExceptionsFilter', () => {
  let filter: HttpExceptionsFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionsFilter],
    }).compile();

    filter = module.get<HttpExceptionsFilter>(HttpExceptionsFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;
  });

  it('should return 500 status and "Internal Server Error" message for generic errors', () => {
    const genericError = new Error('Some error');

    filter.catch(genericError, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      code: 500,
      errmsg: 'Some error',
    });
  });

  it('should return 200 status and specific message for HttpException', () => {
    const httpException = new HttpException('Specific error message', 1001);

    filter.catch(httpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Specific error message',
      code: 1001,
      errmsg: 'Specific error message',
    });
  });
});
