export async function handleRequest<T>(
  promise: Promise<T>
): Promise<[T | null, any | null]> {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
}

export async function handleAsync<T, A>(
  args: A,
  cb: (args: A) => Promise<T>
): Promise<[T | null, any | null]> {
  try {
    return [await cb(args), null];
  } catch (error) {
    return [null, error];
  }
}

export function handleException<T, A>(
  args: A,
  cb: (args: A) => T
): [T, null] | [null, unknown] {
  try {
    return [cb(args), null];
  } catch (error) {
    return [null, error];
  }
}
