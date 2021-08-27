import { memo, useState } from 'react';

import { formClassesConfig } from '../utils/utils';

import Form from './Form';
import FormInput from './FormInput';

const propsForInputs = {
  autoCorrect: 'off',
  spellCheck: false,
  className: `${formClassesConfig.inputClass}_theme_dark`,
};

const inputNames = {
  email: 'email',
  password: 'password',
};

const LoginOrRegister = memo(({ form, ...props }) => {
  const [buttonIsSaving, setButtonIsSaving] = useState(false);

  const buttonTitle = buttonIsSaving ? `${props.buttonSavingTitle}...` : props.buttonTitle;

  function handleSubmit(e) {
    setButtonIsSaving(true);

    const { email, password } = form.getData();

    props.handleSubmit(e, email, password).finally(() => {
      setButtonIsSaving(false);
    });
  }

  return (
    <div className="content auth">
      <h2 className="auth__title">{props.title}</h2>

      <Form onSubmit={handleSubmit} onReset={form.reset}>
        <FormInput
          {...propsForInputs}
          autoFocus
          {...form.register(inputNames.email)}
          id={inputNames.email}
          type={inputNames.email}
          autoComplete={inputNames.email}
          placeholder="Email"
        />
        <FormInput
          {...propsForInputs}
          {...form.register(inputNames.password)}
          type={inputNames.password}
          id={props.passwordAutocomplete}
          autoComplete={props.passwordAutocomplete}
          placeholder="Пароль"
        />
        <button
          type="submit"
          disabled={form.isInvalid || buttonIsSaving}
          className={`auth__button ${formClassesConfig.submitButtonClass} ${formClassesConfig.submitButtonClass}_theme_dark`}
        >
          {buttonTitle}
        </button>
      </Form>
      {props.children}
    </div>
  );
});

export default LoginOrRegister;
