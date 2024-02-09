import { ServerResponse, IncomingMessage } from "http";
import { getPathName, getUserById, getUserId, isInvalidBody, isInvalidId, sendResponse, getBody } from "../utils/helpers";
import { Endpoints, IResponse, ResponseMessages, StatusCodes } from "../types";
import { updateUser } from "./usersController";

export const processPutMethod = async (request: IncomingMessage, response: ServerResponse) => {
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
      sendResponse(response, StatusCodes.BAD_REQUEST, bodyS);

      return;
    };

    const user = getUserById(userId);

    if (user) {
      const body = await getBody(request);

      if (isInvalidBody(body)) {
        const bodyS: IResponse = {
          data: null,
          error: {
            code: StatusCodes.BAD_REQUEST,
            message: ResponseMessages.MISSED_FIELDS
          }
        }
        sendResponse(response, StatusCodes.BAD_REQUEST, bodyS);

        return;
      };

      const updatedUser = updateUser(userId, body);
      const bodyS: IResponse = {
        data: updatedUser,
        error: null
      }
      sendResponse(response, StatusCodes.OK, bodyS);

    } else {
      const bodyS: IResponse = {
        data: null,
        error: {
          code: StatusCodes.NOT_FOUND,
          message: ResponseMessages.NOT_FOUND
        }
      }
      sendResponse(response, StatusCodes.NOT_FOUND, bodyS);
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
