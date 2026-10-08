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
import type { PalvelunTarveEnum } from '../../../api/generated/types.gen';
import styles from '../ApplicationForm.module.css';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '../../markdown-content';

const VAKA_OPTIONS: PalvelunTarveEnum[] = [
  'esiopetus_4h_1h_vaka',
  'esiopetus_4h_1_3h_vaka',
  'esiopetus_4h_3_4h_vaka',
  'esiopetus_4h_4_6h_vaka',
];

const VUOROHOITO_OPTIONS: PalvelunTarveEnum[] = [
  'esiopetus_4h_61_100h_vuoroh',
  'esiopetus_4h_101_160h_vuoroh',
  'esiopetus_4h_160h_vuoroh',
];

export const VarhaiskasvatuksenLaajuus = ({}) => {
  const { control, watch } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  const taydentavaVarhaiskasvatus = useWatch({
    control,
    name: 'taydentavaVarhaiskasvatus',
  });
  const hoidonTarve = useWatch({ control, name: 'hoidonTarve' });

  const palvelunTarveOptions =
    hoidonTarve === 'vuorohoito_varhaiskasvatus'
      ? VUOROHOITO_OPTIONS
      : VAKA_OPTIONS;

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
              {palvelunTarveOptions.map((value) => (
                <div key={value} className={styles['selection-group-item']}>
                  <RadioButton
                    id={value.replace('esiopetus_', '')}
                    data-testid={`rb-${value}`}
                    name={field.name}
                    value={value}
                    label={t(`vakaOptions.${value}`)}
                    checked={field.value === value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                  />
                </div>
              ))}
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
          }}
          render={({ field, fieldState }) => (
            <NumberInput
              id="arki-poissaolot"
              data-testid="input-arki-poissaolot"
              label={t('varhaiskasvatuksenLaajuus.arkipoissaolotLabel')}
              min={0}
              max={30}
              step={1}
              onChange={field.onChange}
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
