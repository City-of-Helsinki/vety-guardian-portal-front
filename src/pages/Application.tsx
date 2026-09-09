import { ApplicationForm } from '../components/application-form';
import { useTranslation } from 'react-i18next';
import { Divider } from '../components/divider';
import {
  FirstStep,
  PreschoolLanguageStep,
} from '../components/application-form/steps';
import { ApplicationFormSteps } from '../components/application-form';
import type { FormStep, FormValues } from '../types';

export const Application = ({}) => {
  const { t } = useTranslation();

  const steps: FormStep[] = [
    {
      id: 'firstStep',
      label: 'Alku',
      fields: ['appliedToPrivatePreschool'],
      component: FirstStep,
    },
    {
      id: 'language',
      label: 'Esiopetuksen kieli',
      fields: ['preschoolLanguage'],
      component: PreschoolLanguageStep,
    },
  ];

  const defaultValues: FormValues = {
    preschoolLanguage: 'fi',
    appliedToPrivatePreschool: false,
  };

  const onSubmit = (values: FormValues) => {
    return;
  };

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
