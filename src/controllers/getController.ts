import { ServerResponse, IncomingMessage } from "http";
import { getUserId, sendResponse, getUserById, isInvalidId, getPathName } from "../utils/helpers";
import { users } from "../data/users";
import { Endpoints, ResponseMessages, StatusCodes } from "../types";

export const processGetMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const pathName = getPathName(request.url, request.headers.host);

  if (pathName === Endpoints.USERS) {
    sendResponse(response, StatusCodes.OK, users);

    return;
  };
  
  if (pathName.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(pathName);

    if (isInvalidId(userId)) {
      sendResponse(response, StatusCodes.BAD_REQUEST, ResponseMessages.INVALID_ID);

      return;
    };

    const user = getUserById(userId);

    if (user) {
      sendResponse(response, StatusCodes.OK, user);

    } else {
      sendResponse(response, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    };

    return;
  };
  
  sendResponse(response, StatusCodes.NOT_FOUND, `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`);
};
