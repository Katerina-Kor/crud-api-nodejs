import { ServerResponse, IncomingMessage } from "http";
import { getPathName, getUserById, getUserId, isInvalidId, sendResponse } from "../utils/helpers";
import { Endpoints, IResponse, ResponseMessages, StatusCodes } from "../types";
import { deleteUser } from "./usersController";

export const processDeleteMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const pathName = getPathName(request.url, request.headers.host);
  
  if (pathName.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(pathName);

    if (isInvalidId(userId)) {
      const bodyS: IResponse = {
        data: null,
        error: {
          code: StatusCodes.BAD_REQUEST,
          message: ResponseMessages.INVALID_ID
        }
      }
      console.log('DELETE 1')
      sendResponse(response, StatusCodes.BAD_REQUEST, bodyS);

      return;
    };

    const user = getUserById(userId);

    if (user) {
      deleteUser(userId);
      const bodyS: IResponse = {
        data: null,
        error: null
      }
      sendResponse(response, StatusCodes.NO_CONTENT, bodyS);

    } else {
      const bodyS: IResponse = {
        data: null,
        error: {
          code: StatusCodes.NOT_FOUND,
          message: ResponseMessages.NOT_FOUND
        }
      }
      sendResponse(response, StatusCodes.NOT_FOUND,bodyS);
    };

    return;
  };
  
  const bodyS: IResponse = {
    data: null,
    error: {
      code: StatusCodes.NOT_FOUND,
      message: `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`
    }
  }
  sendResponse(response, StatusCodes.NOT_FOUND, bodyS);
};
