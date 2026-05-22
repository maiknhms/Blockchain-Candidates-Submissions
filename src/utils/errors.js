export function getErrorMessage(error, fallback = 'Something went wrong.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  return error.message || fallback;
}
