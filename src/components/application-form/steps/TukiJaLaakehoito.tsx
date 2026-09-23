import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { Checkbox, SelectionGroup } from 'hds-react';
import type { FormValues } from '../../../types';
import { Trans, useTranslation } from 'react-i18next';
import styles from '../ApplicationForm.module.css';

export const TukiJaLaakehoito = ({}) => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep title={t('tukiJaLaakehoito.title')}>
      <Trans t={t} i18nKey="tukiJaLaakehoito.tukiJaLaakehoitoText" />
      <SelectionGroup className={styles['selection-group']}>
        <Controller
          name="erityisenTuenTarve"
          control={control}
          render={({ field, fieldState }) => (
            <div className={styles['selection-group-item']}>
              <Checkbox
                id="erityisen-tuen-tarve"
                data-testid="cb-erityinen-tuki"
                label={t('tukiJaLaakehoito.erityinenTukiLabel')}
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                errorText={fieldState.error?.message}
              />
              <Trans t={t} i18nKey="tukiJaLaakehoito.erityinenTukiText" />
            </div>
          )}
        />
        <Controller
          name="laakehoidonTarve"
          control={control}
          render={({ field, fieldState }) => (
            <div className={styles['selection-group-item']}>
              <Checkbox
                id="laakehoidon-tarve"
                data-testid="cb-laakehoidon-tarve"
                label={t('tukiJaLaakehoito.laakehoitoLabel')}
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                errorText={fieldState.error?.message}
              />
              <p>{t('tukiJaLaakehoito.laakehoitoText')}</p>
            </div>
          )}
        />
      </SelectionGroup>
    </ApplicationFormStep>
  );
};
