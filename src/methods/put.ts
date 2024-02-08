import { ServerResponse, IncomingMessage } from "http";
import { createUser, getUrl, getUserById, getUserId, isInvalidBody, isInvalidId, sendResponse, updateUser } from "../utils/helpers";
import { Endpoints, StatusCodes } from "../utils/responseData";
import { getBody } from "../middlewares/getBody";

export const processPutMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const url = getUrl(request.url);
  console.log('put url', url);
  
  if (url.startsWith(Endpoints.CERTAIN_USER)) {
    const userId = getUserId(url);
    console.log('id', userId);

    if (isInvalidId(userId)) {
      sendResponse(response, StatusCodes.BAD_REQUEST);
      return;
    }

    const user = getUserById(userId);

    if (user) {
      const body = await getBody(request);
      console.log('ping', body)

      if (isInvalidBody(body)) {
        sendResponse(response, StatusCodes.BAD_REQUEST, 'Missed required fields')
        return;
      };

      const updatedUser = updateUser(userId, body);
      sendResponse(response, StatusCodes.OK, JSON.stringify(updatedUser));

    } else {
      sendResponse(response, StatusCodes.NOT_FOUND);
    }

  } else {
    sendResponse(response, StatusCodes.NOT_FOUND, `Cannot get ${url} endpoint`);
  }
};
