import { useState } from 'react';

export default function useFormData(initialState) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'time' && value) {
      value = new Date(value).toISOString();
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { formData, setFormData, handleChange };
}
