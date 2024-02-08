import { ServerResponse, IncomingMessage } from "http";
import { getUrl, getUserId, sendResponse, getUserById, isInvalidId } from "../utils/helpers";
import { users } from "../data/users";
import { Endpoints, StatusCodes } from "../utils/responseData";

export const processGetMethod = (request: IncomingMessage, response: ServerResponse) => {
  const url = getUrl(request.url);
  console.log('get url', url);

  if (url === Endpoints.USERS) {
    const body = JSON.stringify(users);
    sendResponse(response, StatusCodes.OK, body);

    return;

  } else if (url.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(url);
    console.log('PING')
    console.log('id', userId);

    if (isInvalidId(userId)) {
      sendResponse(response, StatusCodes.BAD_REQUEST);
      return;
    }

    const user = getUserById(userId);

    if (user) {
      const body = JSON.stringify(user);
      sendResponse(response, StatusCodes.OK, body);
    } else {
      sendResponse(response, StatusCodes.NOT_FOUND);
    }

  } else {
    sendResponse(response, StatusCodes.NOT_FOUND, `Cannot get ${url} endpoint`);
  }
};
