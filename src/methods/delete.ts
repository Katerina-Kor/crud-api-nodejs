import { ServerResponse, IncomingMessage } from "http";
import { createUser, deleteUser, getUrl, getUserById, getUserId, isInvalidBody, isInvalidId, sendResponse, updateUser } from "../utils/helpers";
import { Endpoints, StatusCodes } from "../utils/responseData";

export const processDeleteMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const url = getUrl(request.url);
  console.log('delete url', url);
  
  if (url.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(url);
    console.log('id', userId);

    if (isInvalidId(userId)) {
      sendResponse(response, StatusCodes.BAD_REQUEST);
      return;
    }

    const user = getUserById(userId);

    if (user) {
      deleteUser(userId);
      sendResponse(response, StatusCodes.NO_CONTENT);

    } else {
      sendResponse(response, StatusCodes.NOT_FOUND);
    }

  } else {
    sendResponse(response, StatusCodes.NOT_FOUND, `Cannot get ${url} endpoint`);
  }
};
