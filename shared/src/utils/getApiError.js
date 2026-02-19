const formatValidationErrors = (data) => {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.join(', ');
  // Rails @model.errors format: { field: ["msg", ...], ... }
  return Object.entries(data)
    .map(([field, msgs]) => {
      const messages = Array.isArray(msgs) ? msgs.join(', ') : msgs;
      return `${field.replace(/_/g, ' ')} ${messages}`;
    })
    .join('. ');
};

export const getApiError = (err, fallback = 'Something went wrong') => {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (data.errors) return formatValidationErrors(data.errors);
  // Bare field-keyed validation errors: { reason: ["can't be blank"] }
  if (typeof data === 'object' && !Array.isArray(data)) {
    const formatted = formatValidationErrors(data);
    if (formatted) return formatted;
  }
  return err?.message || fallback;
};
