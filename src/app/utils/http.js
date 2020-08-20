export const conflictError = (error) => {
  return {
    statusCode: 409,
    errors: error.message,
  };
};

export const internalServerError = (error) => {
  return {
    statusCode: 500,
    errors: error.message,
  };
};

export const badRequest = (error) => {
  return {
    statusCode: 400,
    errors: error.message,
  };
};

export const unauthorized = (error) => {
  return {
    statusCode: 401,
    errors: error.message,
  };
};

export const notFound = (error) => {
  return {
    statusCode: 404,
    errors: error.message,
  };
};

export const httpSuccess = (data, metadata = null) => {
  if (metadata) {
    return {
      statusCode: 200,
      metadata,
      data,
    };
  }

  return {
    statusCode: 200,
    data,
  };
};

export const created = (data) => {
  return {
    statusCode: 201,
    data,
  };
};
