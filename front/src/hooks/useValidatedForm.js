import { useCallback, useState } from 'react';

const initialStates = {
  errors: {},
  isInvalid: true,
};

export default function useValidatedForm(initialData = {}) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(initialStates.errors);
  const [isInvalid, setIsInvalid] = useState(initialStates.isInvalid);

  function handleChange(name, value) {
    setData((prevData) => {
      const newData = { ...prevData, [name]: value };

      const newDataEqualsInitial =
        JSON.stringify({ ...initialData, ...newData }) === JSON.stringify(initialData);
      if (newDataEqualsInitial) {
        setIsInvalid(true);
      }

      return newData;
    });
  }

  function handleError(name, validationMessage) {
    setErrors((prevData) => ({ ...prevData, [name]: validationMessage }));
  }

  const reset = useCallback(
    (e_, data) => {
      setData(data ?? initialData);
      setErrors(initialStates.errors);
      setIsInvalid(initialStates.isInvalid);
    },
    [initialData]
  );

  return {
    registerForm() {
      return {
        isSubmitDisabled: isInvalid,
        onReset: reset,
      };
    },
    register(name) {
      return {
        value: data[name] ?? '',
        onChange: (e) => {
          const input = e.currentTarget;
          const { value, validationMessage } = input;

          handleChange(name, value);
          handleError(name, value.length ? validationMessage : '');

          const formValidity = input.closest('form').checkValidity();
          setIsInvalid(!formValidity);
        },
        validationMessage: errors[name],
        name,
      };
    },
    reset,
    getData() {
      return data;
    },
    isInvalid,
  };
}
