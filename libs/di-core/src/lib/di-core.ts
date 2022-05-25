import { ReactNode } from "react";

//--- error handling
type ErrorMessage = {
  message: string;
};
function isErrorMessage(error: unknown): error is ErrorMessage {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as Record<string, unknown>)['message'] === 'string';
}

function toErrorMessage(maybeError: unknown): ErrorMessage {
  if (isErrorMessage(maybeError)) return maybeError;
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function getErrorMsg(error: unknown) {
  return toErrorMessage(error).message;
}
//-----



export interface IComponent {
  loading: boolean;
  error?: Error;
}

