import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.errors?.[0]?.message ??
      error.response?.data?.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
