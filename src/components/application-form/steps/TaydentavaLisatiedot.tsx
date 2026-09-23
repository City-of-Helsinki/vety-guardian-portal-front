import {
  SelectionGroup,
  RadioButton,
  DateInput,
  Fieldset,
  Link,
} from 'hds-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { useEffect } from 'react';
import {
  DISPLAY_DATE_FORMAT,
  dateToIso,
  isoToDisplay,
  isValidDate,
} from '../../../utils/date';
import styles from '../ApplicationForm.module.css';
import { Trans, useTranslation } from 'react-i18next';

export const TaydentavaLisatiedot = ({}) => {
  const { control, watch, resetField } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  const taydentavaVarhaiskasvatus = useWatch({
    control,
    name: 'taydentavaVarhaiskasvatus',
  });

  useEffect(() => {
    if (!taydentavaVarhaiskasvatus) {
      resetField('taydentavaVarhaiskasvatusAloitus');
      resetField('hoidonTarve');
    }
  }, [taydentavaVarhaiskasvatus, resetField]);

  return (
    <ApplicationFormStep title={t('taydentavaLisatiedot.title')}>
      <Trans t={t} i18nKey="taydentavaLisatiedot.taydentavaLisatiedotText" />
      <Link
        data-testid="link-vk-maksut"
        external
        href="https://www.hel.fi/fi/kasvatus-ja-koulutus/varhaiskasvatus/varhaiskasvatusmaksut"
      >
        {t('varhaiskasvatusmaksutAnchor')}
      </Link>
      <h3>{t('taydentavaLisatiedot.fieldsTitle')}</h3>
      <Fieldset heading={t('taydentavaLisatiedot.aloitusPvmTitle')}>
        <Controller
          name="taydentavaVarhaiskasvatusAloitus"
          control={control}
          disabled={!watch('taydentavaVarhaiskasvatus')}
          rules={{
            required: taydentavaVarhaiskasvatus
              ? 'Anna aloituspäivämäärä'
              : false,
          }}
          render={({ field, fieldState }) => (
            <DateInput
              id="extendedCareStartDate"
              data-testid="date-extended-care-start"
              initialMonth={new Date()}
              dateFormat={DISPLAY_DATE_FORMAT}
              value={isoToDisplay(field.value)}
              onChange={(_, valueAsDate) => {
                field.onChange(
                  isValidDate(valueAsDate) ? dateToIso(valueAsDate) : null,
                );
              }}
              onBlur={field.onBlur}
              disabled={field.disabled}
              invalid={!!fieldState.error}
              errorText={fieldState.error?.message}
            />
          )}
        />
      </Fieldset>
      <Controller
        name="hoidonTarve"
        control={control}
        disabled={!watch('taydentavaVarhaiskasvatus')}
        rules={{
          required: taydentavaVarhaiskasvatus ? 'Valitse hoidon tarve' : false,
        }}
        render={({ field, fieldState }) => (
          <SelectionGroup
            className={styles['selection-group']}
            errorText={fieldState.error?.message}
          >
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="paiva-aikainen"
                data-testid="rb-paivaaikainen_varhaiskasvatus"
                name={field.name}
                value="paivaaikainen_varhaiskasvatus"
                label="Esiopetus 4 tuntia jonka lisäksi päiväaikainen varhaiskasvatus"
                checked={field.value === 'paivaaikainen_varhaiskasvatus'}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="paiva-ja-ilta"
                data-testid="rb-paiva_ja_ilta_aikainen_varhaiskasvatus_arkisin"
                name={field.name}
                value="paiva_ja_ilta_aikainen_varhaiskasvatus_arkisin"
                label="Esiopetus 4 tuntia jonka lisäksi päivä- ja ilta-aikainen varhaiskasvatus arkisin"
                checked={
                  field.value ===
                  'paiva_ja_ilta_aikainen_varhaiskasvatus_arkisin'
                }
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="ymparivuorokautinen"
                data-testid="rb-ymparivuorokautinen_varhaiskasvatus"
                name={field.name}
                value="ymparivuorokautinen_varhaiskasvatus"
                label="Esiopetus 4 tuntia arkisin jonka lisäksi ympärivuorokautinen varhaiskasvatus"
                checked={field.value === 'ymparivuorokautinen_varhaiskasvatus'}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
              />
            </div>
          </SelectionGroup>
        )}
      />
    </ApplicationFormStep>
  );
};
