export const processPutMethod = (request, response) => {
  const url = request.url.split("?")[0];

  switch (request.url) {
    case "/posts":
      const id = request.query.searchParams.get("id");
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      request.posts[id] = request.body;
      response.write(JSON.stringify(request.posts[id]));
      response.end();
      break;
      
    default:
      response.statusCode = 400;
      response.write(`CANNOT PUT ${request.url}`);
      response.end();
  }
};
