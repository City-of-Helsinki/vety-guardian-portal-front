import {
  SelectionGroup,
  RadioButton,
  DateInput,
  Fieldset,
  Link,
} from 'hds-react';
import type { ChangeEvent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import {
  DISPLAY_DATE_FORMAT,
  dateToIso,
  isoToDisplay,
  isValidDate,
} from '../../../utils/date';
import styles from '../ApplicationForm.module.css';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '../../markdown-content';

export const TaydentavaLisatiedot = ({}) => {
  const { control, watch, setValue } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  const taydentavaVarhaiskasvatus = useWatch({
    control,
    name: 'taydentavaVarhaiskasvatus',
  });

  // The palvelunTarve options in the next step depend on hoidonTarve, so clear
  // the previous selection when hoidonTarve changes.
  const onHoidonTarveChange =
    (onChange: (event: ChangeEvent<HTMLInputElement>) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event);
      setValue('palvelunTarve', null);
    };

  return (
    <ApplicationFormStep
      data-testid="step-hoidon-tarve"
      title={t('taydentavaLisatiedot.title')}
    >
      <MarkdownContent data-testid="text-taydentava-lisatiedot">
        {t('taydentavaLisatiedot.taydentavaLisatiedotText')}
      </MarkdownContent>
      <Link
        data-testid="link-vk-maksut"
        external
        href="https://www.hel.fi/fi/kasvatus-ja-koulutus/varhaiskasvatus/varhaiskasvatusmaksut"
      >
        {t('varhaiskasvatusmaksutAnchor')}
      </Link>
      <h3 data-testid="title-taydentava-lisatiedot-fields">
        {t('taydentavaLisatiedot.fieldsTitle')}
      </h3>
      <Fieldset
        heading={t('taydentavaLisatiedot.aloitusPvmTitle')}
        data-testid="fieldset-aloitus-pvm"
      >
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
            data-testid="group-hoidon-tarve"
            errorText={fieldState.error?.message}
          >
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="paiva-aikainen"
                data-testid="rb-paivaaikainen_varhaiskasvatus"
                name={field.name}
                value="paivaaikainen_varhaiskasvatus"
                label={t('vakaOptions.paivaaikainen_varhaiskasvatus')}
                checked={field.value === 'paivaaikainen_varhaiskasvatus'}
                onChange={onHoidonTarveChange(field.onChange)}
                onBlur={field.onBlur}
                disabled={field.disabled}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="vuorohoito"
                data-testid="rb-vuorohoito_varhaiskasvatus"
                name={field.name}
                value="vuorohoito_varhaiskasvatus"
                label={t('vakaOptions.vuorohoito_varhaiskasvatus')}
                checked={field.value === 'vuorohoito_varhaiskasvatus'}
                onChange={onHoidonTarveChange(field.onChange)}
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
