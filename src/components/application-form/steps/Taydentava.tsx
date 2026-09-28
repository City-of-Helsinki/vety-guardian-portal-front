import { SelectionGroup, RadioButton, Link } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import styles from '../ApplicationForm.module.css';
import { Trans, useTranslation } from 'react-i18next';

export const Taydentava = ({}) => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep title={t('taydentava.title')}>
      <Trans t={t} i18nKey="taydentava.taydentavaText" />
      <Link
        data-testid="link-vk-maksut"
        external
        href="https://www.hel.fi/fi/kasvatus-ja-koulutus/varhaiskasvatus/varhaiskasvatusmaksut"
      >
        {t('varhaiskasvatusmaksutAnchor')}
      </Link>
      <Controller
        name="taydentavaVarhaiskasvatus"
        control={control}
        rules={{
          validate: (v) =>
            typeof v === 'boolean' ||
            'Valitse täydentävän varhaiskasvatuksen tarve',
        }}
        render={({ field, fieldState }) => (
          <SelectionGroup
            className={styles['selection-group']}
            label={t('taydentava.selectionGroupLabel')}
            errorText={fieldState.error?.message}
          >
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="needs-extended-care"
                data-testid="rb-extended-care"
                name={field.name}
                label={t('taydentava.needsExtendedCare')}
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                onBlur={field.onBlur}
              />
            </div>
            <div className={styles['selection-group-item']}>
              <RadioButton
                id="no-extended-care"
                data-testid="rb-no-extended-care"
                name={field.name}
                label={t('taydentava.doesntNeedExtendedCare')}
                checked={field.value === false}
                onChange={() => field.onChange(false)}
                onBlur={field.onBlur}
              />
            </div>
          </SelectionGroup>
        )}
      />
    </ApplicationFormStep>
  );
};
