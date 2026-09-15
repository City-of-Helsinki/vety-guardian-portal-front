import { ApplicationForm } from '../components/application-form';
import { useTranslation } from 'react-i18next';
import { Divider } from '../components/divider';
import {
  FirstStep,
  PreschoolLanguageStep,
} from '../components/application-form/steps';
import { ApplicationFormSteps } from '../components/application-form';
import type { FormStep, FormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import { preschoolApplicationFormCreateMutation } from '../api/generated/@tanstack/react-query.gen';

export const Application = ({}) => {
  const { t } = useTranslation();

  const createApplication = useMutation(
    preschoolApplicationFormCreateMutation(),
  );

  const steps: FormStep[] = [
    {
      id: 'firstStep',
      label: 'Alku',
      //fields: ['appliedToPrivatePreschool'],
      fields: ['hakenutEnsisijaisestiYksityiseen'],
      component: FirstStep,
    },
    {
      id: 'language',
      label: 'Esiopetuksen kieli',
      //fields: ['preschoolLanguage'],
      fields: ['kieli'],
      component: PreschoolLanguageStep,
    },
  ];

  const defaultValues: FormValues = {
    kieli: 'fi',
    hakenutEnsisijaisestiYksityiseen: false,
  };

  type DrfFieldErrors = Record<string, string | string[]>;

  const onSubmit = (values: FormValues, form: UseFormReturn<FormValues>) => {
    createApplication.mutate(
      { body: values },
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

  /*
  const defaultValues: FormValues = {
    preschoolLanguage: 'fi',
    appliedToPrivatePreschool: false,
  };

  const onSubmit = (values: FormValues) => {
    return;
  };
  */

  return (
    <>
      <h1>{t('application.title')}</h1>
      <Divider />
      <ApplicationForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <ApplicationFormSteps steps={steps} />
      </ApplicationForm>
    </>
  );
};
