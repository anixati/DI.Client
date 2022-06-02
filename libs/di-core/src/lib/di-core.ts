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



// eslint-disable-next-line @typescript-eslint/ban-types
function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop)
}


export interface IComponent {
  loading: boolean;
  error?: Error;
}


export interface ISelectedItem {
  value: number;
  label: string;
  route?: string;
}