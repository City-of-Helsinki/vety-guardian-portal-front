import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { Checkbox, SelectionGroup } from 'hds-react';
import type { FormValues } from '../../../types';
import { useTranslation } from 'react-i18next';
import styles from '../ApplicationForm.module.css';
import { MarkdownContent } from '../../markdown-content';

export const TukiJaLaakehoito = ({}) => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep title={t('tukiJaLaakehoito.title')}>
      <MarkdownContent>
        {t('tukiJaLaakehoito.tukiJaLaakehoitoText')}
      </MarkdownContent>
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
              <MarkdownContent>
                {t('tukiJaLaakehoito.erityinenTukiText')}
              </MarkdownContent>
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
              <MarkdownContent>
                {t('tukiJaLaakehoito.laakehoitoText')}
              </MarkdownContent>
            </div>
          )}
        />
      </SelectionGroup>
    </ApplicationFormStep>
  );
};
