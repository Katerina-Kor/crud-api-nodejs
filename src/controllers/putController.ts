import { ServerResponse, IncomingMessage } from "http";
import { getPathName, getUserById, getUserId, isInvalidBody, isInvalidId, sendResponse, getBody } from "../utils/helpers";
import { Endpoints, ResponseMessages, StatusCodes } from "../types";
import { updateUser } from "./usersController";

export const processPutMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const pathName = getPathName(request.url, request.headers.host);
  
  if (pathName.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(pathName);

    if (isInvalidId(userId)) {
      sendResponse(response, StatusCodes.BAD_REQUEST, ResponseMessages.INVALID_ID);

      return;
    };

    const user = getUserById(userId);

    if (user) {
      const body = await getBody(request);

      if (isInvalidBody(body)) {
        sendResponse(response, StatusCodes.BAD_REQUEST, ResponseMessages.MISSED_FIELDS);

        return;
      };

      const updatedUser = updateUser(userId, body);
      sendResponse(response, StatusCodes.OK, updatedUser);

    } else {
      sendResponse(response, StatusCodes.NOT_FOUND, ResponseMessages.NOT_FOUND);
    };

    return;
  };

  sendResponse(response, StatusCodes.NOT_FOUND, `${ResponseMessages.WRONG_ENDPOINT}: ${pathName}`);
};
