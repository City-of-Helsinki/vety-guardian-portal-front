import { SelectionGroup, RadioButton, NumberInput, Fieldset } from 'hds-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { useEffect } from 'react';
import styles from '../ApplicationForm.module.css';

export const VarhaiskasvatuksenLaajuus = ({}) => {
  const { control, watch, resetField } = useFormContext<FormValues>();

  const taydentavaVarhaiskasvatus = useWatch({
    control,
    name: 'taydentavaVarhaiskasvatus',
  });

  useEffect(() => {
    if (!taydentavaVarhaiskasvatus) {
      resetField('palvelunTarve');
      resetField('arkipoissaolotLkm');
    }
  }, [taydentavaVarhaiskasvatus, resetField]);

  return (
    <ApplicationFormStep title="Esiopetusta täydentävä varhaiskasvatus">
      <Fieldset heading="Varhaiskasvatuksen ja esiopetuksen laajuus yhteensä">
        <Controller
          name="palvelunTarve"
          control={control}
          disabled={!watch('taydentavaVarhaiskasvatus')}
          rules={{
            required: taydentavaVarhaiskasvatus
              ? 'Valitse hoidon tarve'
              : false,
          }}
          render={({ field, fieldState }) => (
            <SelectionGroup className={styles['selection-group']}>
              <div className={styles['selection-group-item']}>
                <RadioButton
                  id="4h_1h_vaka"
                  name={field.name}
                  value="esiopetus_4h_1h_vaka"
                  label="Esiopetus 4 tuntia, jonka lisäksi enintään tunti täydentävää varhaiskasvatusta"
                  checked={field.value === 'esiopetus_4h_1h_vaka'}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              </div>
              <div className={styles['selection-group-item']}>
                <RadioButton
                  id="4h_1_3h_vaka"
                  name={field.name}
                  value="esiopetus_4h_1_3h_vaka"
                  label="Esiopetus 4 tuntia, jonka lisäksi 1-3 tuntia täydentävää varhaiskasvatusta"
                  checked={field.value === 'esiopetus_4h_1_3h_vaka'}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              </div>
              <div className={styles['selection-group-item']}>
                <RadioButton
                  id="4h_3_4h_vaka"
                  name={field.name}
                  value="esiopetus_4h_3_4h_vaka"
                  label="Esiopetus 4 tuntia, jonka lisäksi 3-4 tuntia täydentävää varhaiskasvatusta"
                  checked={field.value === 'esiopetus_4h_3_4h_vaka'}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              </div>
              <div className={styles['selection-group-item']}>
                <RadioButton
                  id="4h_4_6h_vaka"
                  name={field.name}
                  value="esiopetus_4h_4_6h_vaka"
                  label="Esiopetus 4 tuntia, jonka lisäksi 4-6 tuntia täydentävää varhaiskasvatusta"
                  checked={field.value === 'esiopetus_4h_4_6h_vaka'}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              </div>
            </SelectionGroup>
          )}
        />
      </Fieldset>
      <Fieldset heading="Arkipoissaolojen määrä täydentävässä varhaiskasvatuksessa kuukaudessa">
        <Controller
          name="arkipoissaolotLkm"
          control={control}
          disabled={!watch('taydentavaVarhaiskasvatus')}
          rules={{
            required: taydentavaVarhaiskasvatus
              ? 'Syötä poissaolojen määrä'
              : false,
          }}
          render={({ field, fieldState }) => (
            <NumberInput
              id="arki-poissaolot"
              label="Arkipoissaolojen määrä"
              min={0}
              max={30}
              step={1}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
            />
          )}
        />
      </Fieldset>
    </ApplicationFormStep>
  );
};
