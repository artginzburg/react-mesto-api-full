import { memo } from 'react';

import useValidatedForm from '../hooks/useValidatedForm';

import PopupWithForm from './PopupWithForm';
import FormInput from './FormInput';

const AddPlacePopup = memo((props) => {
  const form = useValidatedForm();

  function handleSubmit() {
    return props.onAddPlace(form.getData());
  }

  return (
    <PopupWithForm
      {...props}
      onSubmit={handleSubmit}
      title="Новое место"
      name="element-editor"
      buttonTitle="Создать"
      {...form.registerForm()}
    >
      <FormInput
        isFocused={props.isOpen}
        {...form.register('title')}
        id="element-title"
        placeholder="Название"
        maxLength="30"
      />

      <FormInput
        {...form.register('link')}
        type="url"
        id="element-link"
        placeholder="Ссылка на картинку"
      />
    </PopupWithForm>
  );
});

export default AddPlacePopup;
