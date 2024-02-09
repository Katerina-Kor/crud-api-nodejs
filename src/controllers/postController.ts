import { ServerResponse, IncomingMessage } from "http";
import { getPathName, isInvalidBody, sendResponse, getBody } from "../utils/helpers";
import { Endpoints, IResponse, ResponseMessages, StatusCodes } from "../types";
import { createUser } from "./usersController";

export const processPostMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const pathName = getPathName(request.url, request.headers.host);
  
  if (pathName === Endpoints.USERS) {
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

    const createdUser = createUser(body);
    const bodyS: IResponse = {
      data: createdUser,
      error: null
    }
    sendResponse(response, StatusCodes.CREATED, bodyS);

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
