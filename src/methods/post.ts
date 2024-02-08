import { ServerResponse, IncomingMessage } from "http";
import { createUser, getUrl, isInvalidBody, sendResponse } from "../utils/helpers";
import { Endpoints, StatusCodes } from "../utils/responseData";
import { getBody } from "../middlewares/getBody";

export const processPostMethod = async (request: IncomingMessage, response: ServerResponse) => {
  const url = getUrl(request.url);
  console.log('get url', url);
  
  if (url === Endpoints.USERS) {
    const body = await getBody(request);
    console.log('ping', body)

    if (isInvalidBody(body)) {
      sendResponse(response, StatusCodes.BAD_REQUEST, 'Missed required fields')
      return;
    };

    const createdUser = createUser(body);
    sendResponse(response, StatusCodes.OK, JSON.stringify(createdUser));

    return;

  } else {
    sendResponse(response, StatusCodes.NOT_FOUND, `Cannot get ${url} endpoint`);
  }
};
