import {
  SelectionGroup,
  RadioButton,
  NumberInput,
  Fieldset,
  Link,
} from 'hds-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { useEffect } from 'react';
import styles from '../ApplicationForm.module.css';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '../../markdown-content';

const ARKIPOISSAOLOT_MIN = 0;
const ARKIPOISSAOLOT_MAX = 30;

export const VarhaiskasvatuksenLaajuus = ({}) => {
  const { control, watch, resetField } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');
  const arkipoissaolotRangeError = t('errors.arkipoissaolotRange', {
    min: ARKIPOISSAOLOT_MIN,
    max: ARKIPOISSAOLOT_MAX,
  });

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
    <ApplicationFormStep
      data-testid="step-varhaiskasvatuksen-laajuus"
      title={t('varhaiskasvatuksenLaajuus.title')}
    >
      <MarkdownContent data-testid="text-varhaiskasvatuksen-laajuus">
        {t('varhaiskasvatuksenLaajuus.varhaiskasvatuksenLaajuusText')}
      </MarkdownContent>
      <Link
        data-testid="link-vk-maksut"
        external
        href="https://www.hel.fi/fi/kasvatus-ja-koulutus/varhaiskasvatus/varhaiskasvatusmaksut"
      >
        {t('varhaiskasvatusmaksutAnchor')}
      </Link>
      <Fieldset
        heading={t('varhaiskasvatuksenLaajuus.selectionGroupLabel')}
        data-testid="fieldset-palvelun-tarve"
      >
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
            <SelectionGroup
              className={styles['selection-group']}
              data-testid="group-palvelun-tarve"
              errorText={fieldState.error?.message}
            >
              <div className={styles['selection-group-item']}>
                <RadioButton
                  id="4h_1h_vaka"
                  data-testid="rb-esiopetus_4h_1h_vaka"
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
                  data-testid="rb-esiopetus_4h_1_3h_vaka"
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
                  data-testid="rb-esiopetus_4h_3_4h_vaka"
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
                  data-testid="rb-esiopetus_4h_4_6h_vaka"
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
      <Fieldset
        heading={t('varhaiskasvatuksenLaajuus.arkipoissaolotTitle')}
        data-testid="fieldset-arkipoissaolot"
      >
        <p data-testid="text-arkipoissaolot">
          {t('varhaiskasvatuksenLaajuus.arkipoissaolotText')}
        </p>
        <Controller
          name="arkipoissaolotLkm"
          control={control}
          disabled={!watch('taydentavaVarhaiskasvatus')}
          rules={{
            required: taydentavaVarhaiskasvatus
              ? 'Syötä poissaolojen määrä'
              : false,
            min: {
              value: ARKIPOISSAOLOT_MIN,
              message: arkipoissaolotRangeError,
            },
            max: {
              value: ARKIPOISSAOLOT_MAX,
              message: arkipoissaolotRangeError,
            },
            validate: (value) =>
              value == null ||
              Number.isInteger(value) ||
              t('errors.arkipoissaolotInteger'),
          }}
          render={({ field, fieldState }) => (
            <NumberInput
              id="arki-poissaolot"
              data-testid="input-arki-poissaolot"
              label={t('varhaiskasvatuksenLaajuus.arkipoissaolotLabel')}
              min={ARKIPOISSAOLOT_MIN}
              max={ARKIPOISSAOLOT_MAX}
              step={1}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(
                  e.target.value === '' ? null : Number(e.target.value),
                )
              }
              onBlur={field.onBlur}
              disabled={field.disabled}
              invalid={!!fieldState.error}
              errorText={fieldState.error?.message}
            />
          )}
        />
      </Fieldset>
    </ApplicationFormStep>
  );
};
