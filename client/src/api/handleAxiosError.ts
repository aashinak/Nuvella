import { AxiosError } from "axios";

class APIError extends Error {
  details: unknown;
  constructor(message: string, details: unknown) {
    super(message);
    this.details = details;
  }
}

const handleAxiosError = (error: unknown, defaultMessage: string) => {
  if (error instanceof AxiosError && error.response) {
    throw new APIError(defaultMessage, error.response.data || error.message);
  }
  throw new APIError(defaultMessage, "Unknown error occurred.");
};

export default handleAxiosError;

