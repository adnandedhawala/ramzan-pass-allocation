export const ncErrorHandlers = {
  onError: (error, _request, response) => {
    // eslint-disable-next-line no-console
    console.error(error.stack);
    return response.status(500).end(error.message || "Something went wrong");
  },
  onNoMatch: (_request, response) => {
    return response.status(405).end("API is not found");
  }
};
