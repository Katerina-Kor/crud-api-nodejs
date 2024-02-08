export const processDeleteMethod = (request, response) => {
  const url = request.url.split("?")[0];

  switch (request.url) {
    case "/posts":
      const id = request.query.searchParams.get("id");
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      request.posts.splice(id, 1);
      response.write(JSON.stringify(request.posts));
      response.end();
      break;
      
    default:
      response.statusCode = 400;
      response.write(`CANNOT DELETE ${request.url}`);
      response.end();
  }
};
