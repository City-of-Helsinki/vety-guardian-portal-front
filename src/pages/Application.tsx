import { ApplicationForm } from '../components/application-form';
import { useTranslation } from 'react-i18next';
import { Divider } from '../components/divider';
import {
  Alku,
  Kieli,
  Taydentava,
  TaydentavaLisatiedot,
  TukiJaLaakehoito,
  VarhaiskasvatuksenLaajuus,
  Yhteystiedot,
  Esikatselu,
} from '../components/application-form/steps';
import { ApplicationFormSteps } from '../components/application-form';
import type { FormStep, FormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import { preschoolApplicationFormCreateMutation } from '../api/generated/@tanstack/react-query.gen';

export const Application = ({}) => {
  const { t } = useTranslation('lomake');

  const createApplication = useMutation(
    preschoolApplicationFormCreateMutation(),
  );

  const steps: FormStep[] = [
    {
      id: 'alku',
      label: t('stepper.alku'),
      fields: ['hakenutEnsisijaisestiYksityiseen'],
      component: Alku,
    },
    {
      id: 'kieli',
      label: t('stepper.kieli'),
      fields: ['kieli'],
      component: Kieli,
    },
    {
      id: 'taydentava',
      label: t('stepper.taydentava'),
      fields: ['taydentavaVarhaiskasvatus'],
      component: Taydentava,
    },
    {
      id: 'hoidon-tarve',
      label: t('stepper.taydentavaLisatiedot'),
      fields: ['taydentavaVarhaiskasvatusAloitus', 'hoidonTarve'],
      component: TaydentavaLisatiedot,
    },
    {
      id: 'varhaiskasvatuksen-laajuus',
      label: t('stepper.varhaiskasvatuksenLaajuus'),
      fields: ['palvelunTarve', 'arkipoissaolotLkm'],
      component: VarhaiskasvatuksenLaajuus,
    },
    {
      id: 'tuki-ja-laakehoito',
      label: t('stepper.tukiJaLaakehoito'),
      fields: ['erityisenTuenTarve', 'laakehoidonTarve'],
      component: TukiJaLaakehoito,
    },
    {
      id: 'yhteystiedot',
      label: t('stepper.yhteystiedot'),
      fields: ['h1Sahkoposti', 'h2Sahkoposti'],
      component: Yhteystiedot,
    },
    {
      id: 'esikatselu',
      label: t('stepper.esikatselu'),
      fields: [],
      component: Esikatselu,
    },
  ];

  const defaultValues: FormValues = {
    kieli: 'fi',
    hakenutEnsisijaisestiYksityiseen: false,
  };

  type DrfFieldErrors = Record<string, string | string[]>;

  const omitFields = ['h1SahkopostiConfirm', 'h2SahkopostiConfirm'];

  const onSubmit = (values: FormValues, form: UseFormReturn<FormValues>) => {
    const data = Object.fromEntries(
      Object.entries(values).filter(([k]) => !omitFields.includes(k)),
    );
    createApplication.mutate(
      { body: data },
      {
        onError: (error) => {
          console.error(
            'TODO: Create better DRF errors handler.',
            'raw error:',
            error,
          );

          const fieldErrors = error as unknown as DrfFieldErrors;

          if (fieldErrors && typeof fieldErrors === 'object') {
            Object.entries(fieldErrors).forEach(([field, messages]) => {
              form.setError(field as keyof FormValues, {
                type: 'server',
                message: Array.isArray(messages) ? messages[0] : messages,
              });
            });
          }
        },
      },
    );
  };

  return (
    <>
      <h1>{t('title')}</h1>
      <Divider />
      <ApplicationForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <ApplicationFormSteps steps={steps} />
      </ApplicationForm>
    </>
  );
};
