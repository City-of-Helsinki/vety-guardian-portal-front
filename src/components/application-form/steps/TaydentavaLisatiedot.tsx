import { SelectionGroup, RadioButton, DateInput, Fieldset } from 'hds-react';
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

export const TaydentavaLisatiedot = ({}) => {
  const { control, watch, resetField } = useFormContext<FormValues>();

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
    <ApplicationFormStep title="Esiopetusta täydentävä varhaiskasvatus">
      <Fieldset heading="Täydentävän esiopetuksen aloituspäivä">
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
          <SelectionGroup className={styles['selection-group']}>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="paiva-aikainen"
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
