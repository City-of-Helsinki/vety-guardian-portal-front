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
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  preschoolApplicationFormCreateMutation,
  preschoolApplicationFormUpdateMutation,
} from '../api/generated/@tanstack/react-query.gen';
import type {
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
  const [applicationId, setApplicationId] = useState<string>();

  const createApplication = useMutation(
    preschoolApplicationFormCreateMutation(),
  );
  const updateApplication = useMutation(
    preschoolApplicationFormUpdateMutation(),
  );
  const isSaving = createApplication.isPending || updateApplication.isPending;

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

  const fieldNames = steps.flatMap((step) => step.fields as string[]);

  const save = async (
    values: FormValues,
    status: StatusEnum,
    form: UseFormReturn<FormValues>,
  ): Promise<boolean> => {
    form.clearErrors('root.server');
    try {
      if (!applicationId) {
        const created = await createApplication.mutateAsync({
          body: toBody(values, 'draft'),
        });
        setApplicationId(created.id);
        if (status === 'draft') return true;
        await updateApplication.mutateAsync({
          path: { uuid: created.id },
          body: toBody(values, status),
        });
        return true;
      }
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

  return (
    <>
      <h1>{t('title')}</h1>
      <Divider />
      <ApplicationForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <ApplicationFormSteps
          steps={steps}
          onStepSave={saveDraft}
          isSaving={isSaving}
        />
      </ApplicationForm>
    </>
  );
};
