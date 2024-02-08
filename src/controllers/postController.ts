import { ServerResponse, IncomingMessage } from "http";
import { getPathName, isInvalidBody, sendResponse, getBody } from "../utils/helpers";
import { Endpoints, ResponseMessages, StatusCodes } from "../types";
import { createUser } from "./usersController";

export const processPostMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const pathName = getPathName(request.url, request.headers.host);
  
  if (pathName === Endpoints.USERS) {
    const body = await getBody(request);

    if (isInvalidBody(body)) {
      sendResponse(response, StatusCodes.BAD_REQUEST, ResponseMessages.MISSED_FIELDS);

      return;
    };

    const createdUser = createUser(body);
    sendResponse(response, StatusCodes.CREATED, createdUser);

    return;
  };

  sendResponse(response, StatusCodes.NOT_FOUND, `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`);
};
