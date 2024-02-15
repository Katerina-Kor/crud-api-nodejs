import { processGetMethod } from './getController';
import { StatusCodes, RequestMethods, ResponseMessages, IResponse, IUser } from '../types';
import { processPostMethod } from './postController';
import { processPutMethod } from './putController';
import { processDeleteMethod } from './deleteController';
import { sendResponse } from '../utils/helpers';
import { IncomingMessage, ServerResponse } from 'http';
import { users } from '../data/users';

export const serverHandler = async (request: IncomingMessage, response: ServerResponse, bd?: IUser[]) => {
  const method = request.method;
  const bdUsed = bd ? bd : users;

  let actionNotification = null;

  try {
    switch (method) {
      case RequestMethods.GET:
        await processGetMethod(request, response, bdUsed);
        break;
      
      case RequestMethods.POST:
        actionNotification = await processPostMethod(request,response, bdUsed);
        break;
  
      case RequestMethods.PUT:
        actionNotification = await processPutMethod(request, response, bdUsed);
        break;
  
      case RequestMethods.DELETE:
        actionNotification = await processDeleteMethod(request, response, bdUsed);
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

  return actionNotification;
};