import { TextInput, Fieldset } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';

export const Yhteystiedot = ({}) => {
  const { register } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Yhteystiedot">
      <Fieldset heading="Huoltajan sähköpostiosoite">
        <TextInput
          id="h1-sahkoposti"
          label="Sähköpostiosoite"
          type="email"
          {...register('h1Sahkoposti')}
        />
        <TextInput
          id="h1-sahkoposti-confirm"
          label="Sähköpostiosoite uudestaan"
          type="email"
          {...register('h1SahkopostiConfirm')}
        />
      </Fieldset>
      <Fieldset heading="Toisen huoltajan sähköpostiosoite">
        <TextInput
          id="h2-sahkoposti"
          label="Sähköpostiosoite"
          type="email"
          {...register('h2Sahkoposti')}
        />
        <TextInput
          id="h2-sahkoposti-confirm"
          label="Sähköpostiosoite uudestaan"
          type="email"
          {...register('h2SahkopostiConfirm')}
        />
      </Fieldset>
    </ApplicationFormStep>
  );
};
