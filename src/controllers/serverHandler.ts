import { processGetMethod } from './getController.ts';
import { StatusCodes, RequestMethods, ResponseMessages, IResponse } from '../types';
import { processPostMethod } from './postController.ts';
import { processPutMethod } from './putController.ts';
import { processDeleteMethod } from './deleteController.ts';
import { sendResponse } from '../utils/helpers.ts';
import { IncomingMessage, ServerResponse } from 'http';

export const serverHandler = async (request: IncomingMessage, response: ServerResponse) => {
  const method = request.method;

  try {
    switch (method) {
      case RequestMethods.GET:
        await processGetMethod(request, response);
        break;
      
      case RequestMethods.POST:
        await processPostMethod(request,response);
        break;
  
      case RequestMethods.PUT:
        await processPutMethod(request, response);
        break;
  
      case RequestMethods.DELETE:
        await processDeleteMethod(request, response);
        break;
  
      default:
        const bodyS: IResponse = {
          data: null,
          error: {
            code: StatusCodes.BAD_REQUEST,
            message: ResponseMessages.NO_RESPONSE
          }
        }
        sendResponse(response, StatusCodes.BAD_REQUEST, bodyS);
    }

  } catch (error) {

    const bodyS: IResponse = {
      data: null,
      error: {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessages.SERVER_ERROR
      }
    }
    sendResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, bodyS);
  }
};