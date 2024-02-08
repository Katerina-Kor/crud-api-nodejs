import { ServerResponse, IncomingMessage } from "http";
import { getPathName, getUserById, getUserId, isInvalidId, sendResponse } from "../utils/helpers";
import { Endpoints, ResponseMessages, StatusCodes } from "../types";
import { deleteUser } from "./usersController";

export const processDeleteMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const pathName = getPathName(request.url, request.headers.host);
  
  if (pathName.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(pathName);

    if (isInvalidId(userId)) {
      sendResponse(response, StatusCodes.BAD_REQUEST, ResponseMessages.INVALID_ID);

      return;
    };

    const user = getUserById(userId);

    if (user) {
      deleteUser(userId);
      sendResponse(response, StatusCodes.NO_CONTENT);

    } else {
      sendResponse(response, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    };

    return;
  };
  
  sendResponse(response, StatusCodes.NOT_FOUND, `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`);
};
