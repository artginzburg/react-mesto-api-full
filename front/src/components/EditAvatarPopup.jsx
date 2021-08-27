import { memo } from 'react';

import {
  useCurrentUser,
  useCurrentUserDispatcher,
  sendApiUpdate,
} from '../contexts/CurrentUserContext';

import useValidatedForm from '../hooks/useValidatedForm';

import PopupWithForm from './PopupWithForm';
import FormInput from './FormInput';

const EditAvatarPopup = memo((props) => {
  const form = useValidatedForm();

  const currentUser = useCurrentUser();
  const setCurrentUser = useCurrentUserDispatcher();

  function handleSubmit() {
    props.onUpdateAvatar();

    return sendApiUpdate(setCurrentUser, currentUser, form.getData(), 'updateAvatar');
  }

  return (
    <PopupWithForm
      {...props}
      onSubmit={handleSubmit}
      title="Обновить аватар"
      name="avatar-editor"
      {...form.registerForm()}
    >
      <FormInput
        isFocused={props.isOpen}
        {...form.register('avatar')}
        type="url"
        id="profile-avatar"
        placeholder="Ссылка на картинку"
      />
    </PopupWithForm>
  );
});

export default EditAvatarPopup;
