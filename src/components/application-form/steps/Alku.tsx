import { Checkbox, SelectionGroup, Accordion, Link } from 'hds-react';
import { useFormContext, Controller } from 'react-hook-form';
import { ApplicationFormStep } from '../ApplicationFormStep';
import type { FormValues } from '../../../types';
import { Divider } from '../../divider';
import { useTranslation, Trans } from 'react-i18next';

export const Alku = ({}) => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep title={t('alku.title')}>
      <Trans
        t={t}
        i18nKey="alku.introText"
        components={{
          serviceMap: (
            <Link external href="https://palvelukartta.hel.fi/fi/">
              {''}
            </Link>
          ),
          acceptService: (
            <Link external href="https://hel.fi">
              {''}
            </Link>
          ),
        }}
      />
      <Divider />
      <p>{t('alku.yksityinenDescription')}</p>
      <Controller
        name="hakenutEnsisijaisestiYksityiseen"
        data-testid="cb-hakenut-yksityiseen"
        control={control}
        render={({ field }) => (
          <SelectionGroup>
            <Checkbox
              id="applied-to-private-preschool"
              label={t('alku.yksityinenLabel')}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
            />
          </SelectionGroup>
        )}
      />
      <Accordion heading={t('alku.osoiteMuutosTitle')}>
        <p>{t('alku.osoiteMuutosText')}</p>
      </Accordion>
      <Divider />
      <Link external href="/">
        {t('alku.lisatietoaAnchor')}
      </Link>
    </ApplicationFormStep>
  );
};
