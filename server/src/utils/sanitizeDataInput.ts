function sanitizeData<T>(
  data: T | null,
  fieldsToRemove: (keyof T)[]
): Partial<T> | null {
  if (!data) return null;

  // Convert Mongoose document to plain object if necessary
  const plainData = (typeof data === "object" && "toObject" in data)
    ? (data as any).toObject()
    : data;

  const sanitizedData = { ...plainData };
  fieldsToRemove.forEach((field) => {
    delete sanitizedData[field];
  });

  return sanitizedData;
}

export default sanitizeData;
