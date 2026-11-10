import type { UseFormReturn } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IdentityResponse, PreschoolApplication } from '../api/generated';
import type { FormValues } from '../types';
import {
  applyServerErrors,
  toBody,
  toFormValues,
} from './applicationFormUtils';

const application = (
  overrides: Partial<PreschoolApplication> = {},
): PreschoolApplication => ({
  id: 'application-1',
  createdAt: '2026-11-01T10:00:00Z',
  updatedAt: '2026-11-01T10:00:00Z',
  submittedAt: null,
  status: 'draft',
  hakenutEnsisijaisestiYksityiseen: false,
  kieli: 'fi',
  taydentavaVarhaiskasvatus: true,
  taydentavaVarhaiskasvatusAloitus: '2027-08-10',
  hoidonTarve: 'paivaaikainen_varhaiskasvatus',
  palvelunTarve: 'esiopetus_4h_1_3h_vaka',
  arkipoissaolotLkm: 2,
  erityisenTuenTarve: false,
  laakehoidonTarve: false,
  dependant: 'dependant-1',
  nimi: 'Lapsi Testinen',
  henkilotunnus: '010121A123B',
  karttaosoite: 'Testikatu 1',
  syntymavuosi: 2021,
  h1Nimi: 'Huoltaja Yksi',
  h1Osoite: 'Testikatu 1',
  h1Henkilotunnus: '010190-123A',
  h1Sahkoposti: 'h1.saved@example.com',
  h1Puhelinnumero: '0401111111',
  h2Nimi: 'Huoltaja Kaksi',
  h2Osoite: 'Testikatu 1',
  h2Henkilotunnus: '020290-123B',
  h2Sahkoposti: 'h2.saved@example.com',
  h2Puhelinnumero: '0402222222',
  h1YhteystiedotTallennettu: true,
  h2YhteystiedotTallennettu: true,
  currentGuardian: 'h1',
  ...overrides,
});

const identity = (
  overrides: Partial<IdentityResponse> = {},
): IdentityResponse => ({
  firstName: 'Huoltaja',
  lastName: 'Yksi',
  email: 'profile@example.com',
  phone: '0409999999',
  ...overrides,
});

describe('toBody', () => {
  const values: FormValues = {
    kieli: 'sv',
    taydentavaVarhaiskasvatus: true,
    taydentavaVarhaiskasvatusAloitus: '2027-08-10',
    hoidonTarve: 'vuorohoito_varhaiskasvatus',
    palvelunTarve: 'esiopetus_4h_61_100h_vuoroh',
    arkipoissaolotLkm: 3,
    h1Sahkoposti: 'h1@example.com',
    h1SahkopostiConfirm: 'h1@example.com',
    h2Sahkoposti: 'h2@example.com',
    h2SahkopostiConfirm: 'h2@example.com',
  };

  it('leaves out the email confirmation fields', () => {
    const body = toBody(values, 'draft');
    expect(body).not.toHaveProperty('h1SahkopostiConfirm');
    expect(body).not.toHaveProperty('h2SahkopostiConfirm');
    expect(body).toMatchObject({
      h1Sahkoposti: 'h1@example.com',
      h2Sahkoposti: 'h2@example.com',
    });
  });

  it('sets the given status', () => {
    expect(toBody({ ...values, status: 'draft' }, 'submitted').status).toBe(
      'submitted',
    );
  });

  it('keeps extended care details when extended care is needed', () => {
    expect(toBody(values, 'draft')).toMatchObject({
      taydentavaVarhaiskasvatus: true,
      taydentavaVarhaiskasvatusAloitus: '2027-08-10',
      hoidonTarve: 'vuorohoito_varhaiskasvatus',
      palvelunTarve: 'esiopetus_4h_61_100h_vuoroh',
      arkipoissaolotLkm: 3,
    });
  });

  it('clears extended care details when extended care is not needed', () => {
    expect(
      toBody({ ...values, taydentavaVarhaiskasvatus: false }, 'draft'),
    ).toMatchObject({
      taydentavaVarhaiskasvatus: false,
      taydentavaVarhaiskasvatusAloitus: null,
      hoidonTarve: null,
      palvelunTarve: null,
      arkipoissaolotLkm: null,
    });
  });

  it('keeps extended care details while the question is unanswered', () => {
    expect(
      toBody({ ...values, taydentavaVarhaiskasvatus: null }, 'draft'),
    ).toMatchObject({
      taydentavaVarhaiskasvatusAloitus: '2027-08-10',
      hoidonTarve: 'vuorohoito_varhaiskasvatus',
    });
  });
});

describe('toFormValues', () => {
  it('maps the editable fields of a saved application', () => {
    expect(toFormValues(application())).toEqual({
      hakenutEnsisijaisestiYksityiseen: false,
      kieli: 'fi',
      taydentavaVarhaiskasvatus: true,
      taydentavaVarhaiskasvatusAloitus: '2027-08-10',
      hoidonTarve: 'paivaaikainen_varhaiskasvatus',
      palvelunTarve: 'esiopetus_4h_1_3h_vaka',
      arkipoissaolotLkm: 2,
      erityisenTuenTarve: false,
      laakehoidonTarve: false,
      h1Sahkoposti: 'h1.saved@example.com',
      h1SahkopostiConfirm: 'h1.saved@example.com',
      h1Puhelinnumero: '0401111111',
      h2Sahkoposti: 'h2.saved@example.com',
      h2SahkopostiConfirm: 'h2.saved@example.com',
      h2Puhelinnumero: '0402222222',
      status: 'draft',
    });
  });

  it('uses defaults for an empty draft', () => {
    const values = toFormValues(
      application({
        hakenutEnsisijaisestiYksityiseen: null,
        kieli: '',
        taydentavaVarhaiskasvatus: null,
        arkipoissaolotLkm: null,
        h1Sahkoposti: null,
        h2Sahkoposti: null,
      }),
    );
    expect(values).toMatchObject({
      hakenutEnsisijaisestiYksityiseen: false,
      kieli: 'fi',
      taydentavaVarhaiskasvatus: null,
      arkipoissaolotLkm: 0,
      h1SahkopostiConfirm: undefined,
      h2SahkopostiConfirm: undefined,
    });
  });

  it("replaces the current guardian's contact details with the profile's", () => {
    const values = toFormValues(
      application({ currentGuardian: 'h1' }),
      identity(),
    );
    expect(values).toMatchObject({
      h1Sahkoposti: 'profile@example.com',
      h1SahkopostiConfirm: 'profile@example.com',
      h1Puhelinnumero: '0409999999',
      h2Sahkoposti: 'h2.saved@example.com',
      h2Puhelinnumero: '0402222222',
    });
  });

  it('replaces the second guardian’s details when they are logged in', () => {
    const values = toFormValues(
      application({ currentGuardian: 'h2' }),
      identity(),
    );
    expect(values).toMatchObject({
      h1Sahkoposti: 'h1.saved@example.com',
      h1Puhelinnumero: '0401111111',
      h2Sahkoposti: 'profile@example.com',
      h2SahkopostiConfirm: 'profile@example.com',
      h2Puhelinnumero: '0409999999',
    });
  });

  it('keeps saved values for details missing from the profile', () => {
    const values = toFormValues(
      application({ currentGuardian: 'h1' }),
      identity({ email: '', phone: '0409999999' }),
    );
    expect(values).toMatchObject({
      h1Sahkoposti: 'h1.saved@example.com',
      h1SahkopostiConfirm: 'h1.saved@example.com',
      h1Puhelinnumero: '0409999999',
    });
  });

  it('keeps saved contact details of a submitted application', () => {
    const values = toFormValues(
      application({ status: 'submitted', currentGuardian: 'h1' }),
      identity(),
    );
    expect(values).toMatchObject({
      h1Sahkoposti: 'h1.saved@example.com',
      h1Puhelinnumero: '0401111111',
    });
  });

  it('keeps saved contact details without a profile or current guardian', () => {
    expect(toFormValues(application(), undefined)).toMatchObject({
      h1Sahkoposti: 'h1.saved@example.com',
    });
    expect(
      toFormValues(application({ currentGuardian: null }), identity()),
    ).toMatchObject({
      h1Sahkoposti: 'h1.saved@example.com',
      h2Sahkoposti: 'h2.saved@example.com',
    });
  });
});

describe('applyServerErrors', () => {
  const fieldNames = ['kieli', 'h1Sahkoposti'];
  let setError: ReturnType<typeof vi.fn>;
  let form: UseFormReturn<FormValues>;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    setError = vi.fn();
    form = { setError } as unknown as UseFormReturn<FormValues>;
  });

  it('sets the first message of each known field on that field', () => {
    applyServerErrors(
      {
        kieli: ['Virheellinen kieli.', 'Toinen virhe.'],
        h1Sahkoposti: 'Virheellinen sähköposti.',
      },
      form,
      fieldNames,
    );
    expect(setError).toHaveBeenCalledWith('kieli', {
      type: 'server',
      message: 'Virheellinen kieli.',
    });
    expect(setError).toHaveBeenCalledWith('h1Sahkoposti', {
      type: 'server',
      message: 'Virheellinen sähköposti.',
    });
  });

  it('shows errors for other fields as a form-level error', () => {
    applyServerErrors(
      { nonFieldErrors: ['Hakemus on jo lähetetty.'] },
      form,
      fieldNames,
    );
    expect(setError).toHaveBeenCalledExactlyOnceWith('root.server', {
      type: 'server',
      message: 'Hakemus on jo lähetetty.',
    });
  });

  it('shows a non-object error as a form-level error', () => {
    applyServerErrors('Internal Server Error', form, fieldNames);
    expect(setError).toHaveBeenCalledExactlyOnceWith('root.server', {
      type: 'server',
      message: 'Internal Server Error',
    });
  });

  it('shows a missing error body as a form-level error', () => {
    applyServerErrors(null, form, fieldNames);
    expect(setError).toHaveBeenCalledExactlyOnceWith('root.server', {
      type: 'server',
      message: 'null',
    });
  });
});
