const classToSelector = (className) => `.${className}`;

export const popupSelectors = {
  closeButtonClass: 'popup__close-button',
};

export const formClassesConfig = {
  inputClass: 'form__input',
  submitButtonClass: 'form__button',
};

export const defaultFormConfig = {
  formSelector: classToSelector(formClassesConfig.formClass),
  inputSelector: classToSelector(formClassesConfig.inputClass),
  submitButtonSelector: classToSelector(formClassesConfig.submitButtonClass),
  inputErrorClass: formClassesConfig.inputErrorClass,
  errorClass: formClassesConfig.errorClass,
};
