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
import type { StatusEnum } from '../api/generated';
import { StepsContextProvider } from '../components/application-form/StepsContext';
import { useGuardianIdentity } from '../auth/useGuardianIdentity';
import {
  applyServerErrors,
  toBody,
  toFormValues,
} from './applicationFormUtils';

export const Application = () => {
  const { t } = useTranslation('lomake');

  const navigate = useNavigate();
  const { applicationId = '' } = useParams();
  const { identity } = useGuardianIdentity();

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
      isFilled: (v) => v.hakenutEnsisijaisestiYksityiseen != null,
    },
    {
      id: 'kieli',
      label: t('stepper.kieli'),
      fields: ['kieli'],
      component: Kieli,
      isFilled: (v) => !!v.kieli,
    },
    {
      id: 'taydentava',
      label: t('stepper.taydentava'),
      fields: ['taydentavaVarhaiskasvatus'],
      component: Taydentava,
      isFilled: (v) => typeof v.taydentavaVarhaiskasvatus === 'boolean',
    },
    {
      id: 'hoidon-tarve',
      label: t('stepper.taydentavaLisatiedot'),
      fields: ['taydentavaVarhaiskasvatusAloitus', 'hoidonTarve'],
      component: TaydentavaLisatiedot,
      isSkipped: (v) => v.taydentavaVarhaiskasvatus === false,
      isFilled: (v) =>
        v.taydentavaVarhaiskasvatus === false ||
        (!!v.taydentavaVarhaiskasvatusAloitus && !!v.hoidonTarve),
    },
    {
      id: 'varhaiskasvatuksen-laajuus',
      label: t('stepper.varhaiskasvatuksenLaajuus'),
      fields: ['palvelunTarve', 'arkipoissaolotLkm'],
      component: VarhaiskasvatuksenLaajuus,
      isSkipped: (v) => v.taydentavaVarhaiskasvatus === false,
      isFilled: (v) =>
        v.taydentavaVarhaiskasvatus === false ||
        (!!v.palvelunTarve && v.arkipoissaolotLkm != null),
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
      fields: [
        'h1Sahkoposti',
        'h1SahkopostiConfirm',
        'h1Puhelinnumero',
        'h2Sahkoposti',
        'h2SahkopostiConfirm',
        'h2Puhelinnumero',
      ],
      component: Yhteystiedot,
      isFilled: (v) => !!v.h1Sahkoposti,
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
      return <LoadingSpinner data-testid="loading-spinner" />;
    }
    if (application.isError) {
      return (
        <Notification
          type="error"
          label={t('loadError')}
          data-testid="notification-load-error"
        >
          {String(application.error)}
        </Notification>
      );
    }
    // A submitted application can't be edited: show only the sent information (Esikatselu step).
    const isSubmitted = application.data.status === 'submitted';
    return (
      <ApplicationDataContext.Provider value={application.data}>
        <h2 style={{ textAlign: 'left' }}>{application.data.nimi}</h2>
        <Divider />
        <ApplicationForm
          defaultValues={toFormValues(application.data, identity.data)}
          onSubmit={onSubmit}
        >
          {isSubmitted ? (
            <StepsContextProvider
              value={{ goToStep: () => {}, currentId: 'esikatselu' }}
            >
              <Esikatselu />
            </StepsContextProvider>
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
      <h1 data-testid="title-application">{t('title')}</h1>
      {renderContent()}
    </>
  );
};
