import { TextInput, Fieldset } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';

export const Yhteystiedot = ({}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <ApplicationFormStep title="Yhteystiedot">
      <Fieldset heading="Huoltajan sähköpostiosoite">
        <TextInput
          id="h1-sahkoposti"
          label="Sähköpostiosoite"
          type="email"
          {...register('h1Sahkoposti', {
            required: 'Sähköpostiosoite vaaditaan',
          })}
          invalid={!!errors.h1Sahkoposti}
          errorText={errors.h1Sahkoposti?.message}
        />
        <TextInput
          id="h1-sahkoposti-confirm"
          label="Sähköpostiosoite uudestaan"
          type="email"
          {...register('h1SahkopostiConfirm')}
          invalid={!!errors.h1SahkopostiConfirm}
          errorText={errors.h1SahkopostiConfirm?.message}
        />
      </Fieldset>
      <Fieldset heading="Toisen huoltajan sähköpostiosoite">
        <TextInput
          id="h2-sahkoposti"
          label="Sähköpostiosoite"
          type="email"
          {...register('h2Sahkoposti')}
          invalid={!!errors.h2Sahkoposti}
          errorText={errors.h2Sahkoposti?.message}
        />
        <TextInput
          id="h2-sahkoposti-confirm"
          label="Sähköpostiosoite uudestaan"
          type="email"
          {...register('h2SahkopostiConfirm')}
          invalid={!!errors.h2SahkopostiConfirm}
          errorText={errors.h2SahkopostiConfirm?.message}
        />
      </Fieldset>
    </ApplicationFormStep>
  );
};
