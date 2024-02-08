import { processGetMethod } from './getController.ts';
import { StatusCodes, RequestMethods, ResponseMessages } from '../types';
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
        sendResponse(response, StatusCodes.BAD_REQUEST, ResponseMessages.NO_RESPONSE);
    }

  } catch (error) {
    sendResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ResponseMessages.SERVER_ERROR);
  }
};