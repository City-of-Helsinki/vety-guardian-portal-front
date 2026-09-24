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
import {
  ApplicationDataContext,
  ApplicationFormSteps,
} from '../components/application-form';
import type { FormStep, FormValues } from '../types';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { LoadingSpinner, Notification } from 'hds-react';
import {
  preschoolApplicationFormRetrieveOptions,
  preschoolApplicationFormUpdateMutation,
} from '../api/generated/@tanstack/react-query.gen';
import type {
  PreschoolApplication,
  PreschoolApplicationWritable,
  StatusEnum,
} from '../api/generated';

type DrfFieldErrors = Record<string, string | string[]>;

const omitFields = ['h1SahkopostiConfirm', 'h2SahkopostiConfirm'];

const toBody = (
  values: FormValues,
  status: StatusEnum,
): PreschoolApplicationWritable => ({
  ...Object.fromEntries(
    Object.entries(values).filter(([k]) => !omitFields.includes(k)),
  ),
  status,
});

// Only the editable fields go into the form; the read-only VTJ data is shown via ApplicationDataContext.
const toFormValues = (application: PreschoolApplication): FormValues => ({
  // Fields with default values.
  hakenutEnsisijaisestiYksityiseen:
    application.hakenutEnsisijaisestiYksityiseen ?? false,
  kieli: application.kieli || 'fi',
  // No default value. Can have "null" value.
  taydentavaVarhaiskasvatus: application.taydentavaVarhaiskasvatus,
  taydentavaVarhaiskasvatusAloitus:
    application.taydentavaVarhaiskasvatusAloitus,
  hoidonTarve: application.hoidonTarve,
  palvelunTarve: application.palvelunTarve,
  arkipoissaolotLkm: application.arkipoissaolotLkm,
  erityisenTuenTarve: application.erityisenTuenTarve,
  laakehoidonTarve: application.laakehoidonTarve,
  h1Sahkoposti: application.h1Sahkoposti,
  h1Puhelinnumero: application.h1Puhelinnumero,
  h2Sahkoposti: application.h2Sahkoposti,
  h2Puhelinnumero: application.h2Puhelinnumero,
  status: application.status,
});

const applyServerErrors = (
  error: unknown,
  form: UseFormReturn<FormValues>,
  fieldNames: string[],
) => {
  console.error('Saving application failed:', error);

  const fieldErrors = error as DrfFieldErrors | null;
  if (!fieldErrors || typeof fieldErrors !== 'object') {
    form.setError('root.server', { type: 'server', message: String(error) });
    return;
  }

  Object.entries(fieldErrors).forEach(([field, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (fieldNames.includes(field)) {
      form.setError(field as keyof FormValues, { type: 'server', message });
    } else {
      // nonFieldErrors, status (e.g. application has already been sent)
      form.setError('root.server', { type: 'server', message });
    }
  });
};

export const Application = ({}) => {
  const { t } = useTranslation('lomake');

  const navigate = useNavigate();
  const { applicationId = '' } = useParams();

  // No cache: the form reads its defaultValues only on mount, so it must never start from stale data.
  const application = useQuery({
    ...preschoolApplicationFormRetrieveOptions({
      path: { uuid: applicationId },
    }),
    gcTime: 0,
  });
  const updateApplication = useMutation(
    preschoolApplicationFormUpdateMutation(),
  );
  const isSaving = updateApplication.isPending;

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

  const fieldNames = steps.flatMap((step) => step.fields as string[]);

  const save = async (
    values: FormValues,
    status: StatusEnum,
    form: UseFormReturn<FormValues>,
  ): Promise<boolean> => {
    form.clearErrors('root.server');
    try {
      await updateApplication.mutateAsync({
        path: { uuid: applicationId },
        body: toBody(values, status),
      });
      return true;
    } catch (error) {
      applyServerErrors(error, form, fieldNames);
      return false;
    }
  };

  const saveDraft = (values: FormValues, form: UseFormReturn<FormValues>) =>
    save(values, 'draft', form);

  const onSubmit = async (
    values: FormValues,
    form: UseFormReturn<FormValues>,
  ) => {
    if (isSaving) return;
    const submitted = await save(values, 'submitted', form);
    if (submitted) {
      // TODO: Show confirmation / redirect to the correct page
      navigate('/');
    }
  };

  const renderContent = () => {
    if (application.isPending) {
      return <LoadingSpinner />;
    }
    if (application.isError) {
      return (
        <Notification type="error" label={t('loadError')}>
          {String(application.error)}
        </Notification>
      );
    }
    // A submitted application can't be edited: show only the sent information (Esikatselu step).
    const isSubmitted = application.data.status === 'submitted';
    return (
      <ApplicationDataContext.Provider value={application.data}>
        <ApplicationForm
          defaultValues={toFormValues(application.data)}
          onSubmit={onSubmit}
        >
          {isSubmitted ? (
            <Esikatselu />
          ) : (
            <ApplicationFormSteps
              steps={steps}
              onStepSave={saveDraft}
              isSaving={isSaving}
            />
          )}
        </ApplicationForm>
      </ApplicationDataContext.Provider>
    );
  };

  return (
    <>
      <h1>{t('title')}</h1>
      <Divider />
      {renderContent()}
    </>
  );
};
