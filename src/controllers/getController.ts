import { ServerResponse, IncomingMessage } from "http";
import { getUserId, sendResponse, isInvalidId, getPathName } from "../utils/helpers";
import { Endpoints, IResponse, IUser, ResponseMessages, StatusCodes } from "../types";
import { getUserById } from "./usersController";

export const processGetMethod = async (request: IncomingMessage, response: ServerResponse, bd: IUser[]) => {
  const pathName = getPathName(request.url, request.headers.host);

  if (pathName === Endpoints.USERS) {
    const body: IResponse = {
      data: bd,
      error: null,
    }
    sendResponse(response, StatusCodes.OK, body);

    return;
  };
  
  if (pathName.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(pathName);

    if (isInvalidId(userId)) {
      const body: IResponse = {
        data: null,
        error: {
          code: StatusCodes.BAD_REQUEST,
          message: ResponseMessages.INVALID_ID
        }
      }
      sendResponse(response, StatusCodes.BAD_REQUEST, body);

      return;
    };

    const user = getUserById(userId, bd);

    if (user) {
      const body: IResponse = {
        data: user,
        error: null
      }
      sendResponse(response, StatusCodes.OK, body);

    } else {
      const body: IResponse = {
        data: null,
        error: {
          code: StatusCodes.NOT_FOUND,
          message: ResponseMessages.NOT_FOUND
        }
      }
      sendResponse(response, StatusCodes.NOT_FOUND, body);
    };

    return;
  };
  
  const body: IResponse = {
    data: null,
    error: {
      code: StatusCodes.NOT_FOUND,
      message: `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`
    }
  }
  sendResponse(response, StatusCodes.NOT_FOUND, body);
};
