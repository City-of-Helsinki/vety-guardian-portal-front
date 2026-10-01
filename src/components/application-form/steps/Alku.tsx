import { Checkbox, SelectionGroup, Accordion, Link } from 'hds-react';
import { useFormContext, Controller } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { Divider } from '../../divider';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '../../markdown-content';

export const Alku = ({}) => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep data-testid="step-alku" title={t('alku.title')}>
      <MarkdownContent data-testid="text-alku-intro">
        {t('alku.introText')}
      </MarkdownContent>
      <Divider />
      <p data-testid="text-yksityinen-description">
        {t('alku.yksityinenDescription')}
      </p>
      <Controller
        name="hakenutEnsisijaisestiYksityiseen"
        control={control}
        render={({ field, fieldState }) => (
          <SelectionGroup>
            <Checkbox
              id="applied-to-private-preschool"
              data-testid="cb-hakenut-yksityiseen"
              label={t('alku.yksityinenLabel')}
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              errorText={fieldState.error?.message}
            />
          </SelectionGroup>
        )}
      />
      <Accordion
        heading={t('alku.osoiteMuutosTitle')}
        data-testid="accordion-osoitemuutos"
      >
        <p data-testid="text-osoitemuutos">{t('alku.osoiteMuutosText')}</p>
      </Accordion>
      <Divider />
    </ApplicationFormStep>
  );
};
