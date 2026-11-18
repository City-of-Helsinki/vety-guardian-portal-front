import type { UseFormReturn } from 'react-hook-form';
import type { TFunction } from 'i18next';
import type {
  IdentityResponse,
  PreschoolApplication,
  PreschoolApplicationWritable,
  StatusEnum,
} from '../api/generated';
import type { FormValues } from '../types';

export const UNKNOWN_ERROR = [
  'errors.unknown',
  'Tapahtui virhe. Yritä myöhemmin uudelleen.',
] as const;

const omitFields = new Set(['h1SahkopostiConfirm', 'h2SahkopostiConfirm']);

export const toBody = (
  values: FormValues,
  status: StatusEnum,
): PreschoolApplicationWritable => {
  return {
    ...Object.fromEntries(
      Object.entries(values).filter(([k]) => !omitFields.has(k)),
    ),
    ...(values.taydentavaVarhaiskasvatus === false && {
      taydentavaVarhaiskasvatusAloitus: null,
      hoidonTarve: null,
      palvelunTarve: null,
      arkipoissaolotLkm: null,
    }),
    ...(values.hoidonTarve === 'vuorohoito_varhaiskasvatus' && {
      arkipoissaolotLkm: null,
    }),
    status,
  };
};

// Only the editable fields go into the form; the read-only VTJ data is shown via ApplicationDataContext.
export const toFormValues = (
  application: PreschoolApplication,
  identity?: IdentityResponse,
): FormValues => {
  const values: FormValues = {
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
    arkipoissaolotLkm: application.arkipoissaolotLkm ?? 0,
    erityisenTuenTarve: application.erityisenTuenTarve,
    laakehoidonTarve: application.laakehoidonTarve,
    h1Sahkoposti: application.h1Sahkoposti,
    // Confirm fields aren't persisted; a saved email has already been confirmed.
    h1SahkopostiConfirm: application.h1Sahkoposti ?? undefined,
    h1Puhelinnumero: application.h1Puhelinnumero,
    h2Sahkoposti: application.h2Sahkoposti,
    h2SahkopostiConfirm: application.h2Sahkoposti ?? undefined,
    h2Puhelinnumero: application.h2Puhelinnumero,
    status: application.status,
  };

  // The logged-in guardian's contact details found in Helsinki-profiili aren't editable
  // in the form, so they replace any values saved to the application earlier.
  const guardian = application.currentGuardian;
  if (guardian && identity && application.status !== 'submitted') {
    if (identity.email) {
      values[`${guardian}Sahkoposti`] = identity.email;
      values[`${guardian}SahkopostiConfirm`] = identity.email;
    }
    if (identity.phone) {
      values[`${guardian}Puhelinnumero`] = identity.phone;
    }
  }
  return values;
};

export const applyServerErrors = (
  error: unknown,
  form: UseFormReturn<FormValues>,
  fieldNames: string[],
  t: TFunction<'lomake'>,
) => {
  console.error('Saving application failed:', error);

  const unknownError = t(...UNKNOWN_ERROR);

  if (!error || typeof error !== 'object' || Array.isArray(error)) {
    form.setError('root.server', { type: 'server', message: unknownError });
    return;
  }

  const rootMessages = new Set<string>();
  Object.entries(error).forEach(([field, errors]) => {
    const code: unknown = Array.isArray(errors) ? errors[0]?.code : undefined;
    const message =
      typeof code === 'string'
        ? t([`errors.${field}.${code}`, `errors.${code}`], unknownError)
        : unknownError;

    if (fieldNames.includes(field)) {
      form.setError(field as keyof FormValues, { type: 'server', message });
    } else {
      // nonFieldErrors, status (e.g. application has already been sent)
      rootMessages.add(message);
    }
  });
  if (rootMessages.size > 0) {
    form.setError('root.server', {
      type: 'server',
      message: [...rootMessages].join(' '),
    });
  }
};
