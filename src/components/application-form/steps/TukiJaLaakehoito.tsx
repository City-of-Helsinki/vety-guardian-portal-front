import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { SelectionGroupItem } from '../SelectionGroupItem';
import { Checkbox, SelectionGroup } from 'hds-react';
import type { FormValues } from '../../../types';
import { useTranslation } from 'react-i18next';
import styles from '../ApplicationForm.module.css';
import { MarkdownContent } from '../../markdown-content';

export const TukiJaLaakehoito = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep
      data-testid="step-tuki-ja-laakehoito"
      title={t('tukiJaLaakehoito.title')}
    >
      <MarkdownContent data-testid="text-tuki-ja-laakehoito">
        {t('tukiJaLaakehoito.tukiJaLaakehoitoText')}
      </MarkdownContent>
      <SelectionGroup
        className={styles['selection-group']}
        data-testid="group-tuki-ja-laakehoito"
      >
        <Controller
          name="erityisenTuenTarve"
          control={control}
          render={({ field, fieldState }) => (
            <SelectionGroupItem id="erityisen-tuen-tarve-item">
              <Checkbox
                id="erityisen-tuen-tarve"
                data-testid="cb-erityinen-tuki"
                label={t('tukiJaLaakehoito.erityinenTukiLabel')}
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                errorText={fieldState.error?.message}
              />
              <MarkdownContent data-testid="text-erityinen-tuki">
                {t('tukiJaLaakehoito.erityinenTukiText')}
              </MarkdownContent>
            </SelectionGroupItem>
          )}
        />
        <Controller
          name="laakehoidonTarve"
          control={control}
          render={({ field, fieldState }) => (
            <SelectionGroupItem id="laakehoidon-tarve-item">
              <Checkbox
                id="laakehoidon-tarve"
                data-testid="cb-laakehoidon-tarve"
                label={t('tukiJaLaakehoito.laakehoitoLabel')}
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                errorText={fieldState.error?.message}
              />
              <MarkdownContent data-testid="text-laakehoito">
                {t('tukiJaLaakehoito.laakehoitoText')}
              </MarkdownContent>
            </SelectionGroupItem>
          )}
        />
      </SelectionGroup>
    </ApplicationFormStep>
  );
};
