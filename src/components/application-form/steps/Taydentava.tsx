import { SelectionGroup, RadioButton } from 'hds-react';
import { Controller, useFormContext } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import { SelectionGroupItem } from '../SelectionGroupItem';
import type { FormValues } from '../../../types';
import styles from '../ApplicationForm.module.css';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '../../markdown-content';

export const Taydentava = () => {
  const { control, setValue } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep
      data-testid="step-taydentava"
      title={t('taydentava.title')}
    >
      <MarkdownContent data-testid="text-taydentava">
        {t('taydentava.taydentavaText')}
      </MarkdownContent>
      <Controller
        name="taydentavaVarhaiskasvatus"
        control={control}
        rules={{
          validate: (v) => typeof v === 'boolean' || t('errors.required'),
        }}
        render={({ field, fieldState }) => (
          <SelectionGroup
            className={styles['selection-group']}
            data-testid="group-taydentava"
            label={t('taydentava.selectionGroupLabel')}
            errorText={fieldState.error?.message}
          >
            <SelectionGroupItem id="needs-extended-care-item">
              <RadioButton
                id="needs-extended-care"
                data-testid="rb-extended-care"
                name={field.name}
                label={t('taydentava.needsExtendedCare')}
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                onBlur={field.onBlur}
              />
            </SelectionGroupItem>
            <SelectionGroupItem id="no-extended-care-item">
              <RadioButton
                id="no-extended-care"
                data-testid="rb-no-extended-care"
                name={field.name}
                label={t('taydentava.doesntNeedExtendedCare')}
                checked={field.value === false}
                onChange={() => {
                  field.onChange(false);
                  // Clear the extended care details (steps 4 and 5), which may not be mounted.
                  setValue('taydentavaVarhaiskasvatusAloitus', null);
                  setValue('hoidonTarve', null);
                  setValue('palvelunTarve', null);
                  setValue('arkipoissaolotLkm', 0);
                }}
                onBlur={field.onBlur}
              />
            </SelectionGroupItem>
          </SelectionGroup>
        )}
      />
    </ApplicationFormStep>
  );
};
