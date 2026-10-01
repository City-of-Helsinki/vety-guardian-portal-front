import type { Dependant } from '../../api/generated';
import { preschoolApplicationFormForDependantCreateMutation } from '../../api/generated/@tanstack/react-query.gen';
import { DependantIcon } from '../dependant-icon';
import styles from './DependantItem.module.css';
import { Button, ButtonVariant } from 'hds-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ageFromIso, isoToDisplay } from '../../utils/date';

interface DependantItemProps {
  item: Dependant;
  // Position in the dependant list, used only for data-testids.
  index: number;
  guardianSsn: string;
  canApply: boolean;
}

export const DependantItem = ({
  item,
  index,
  guardianSsn,
  canApply,
}: DependantItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openApplication = useMutation({
    ...preschoolApplicationFormForDependantCreateMutation(),
    onSuccess: (application) => navigate(`/application/${application.id}`),
  });

  const age = ageFromIso(item.dateOfBirth);

  return (
    <div className={styles.item} data-testid={`dependant-${index}`}>
      <div className={styles['dependant-card']}>
        <div className={styles['dependant-icon']}>
          <DependantIcon />
        </div>
        <div className={styles['basic-info']}>
          <span
            className={styles['age-text']}
            data-testid={`dependant-age-${index}`}
          >
            {isoToDisplay(item.dateOfBirth)}
            {age && ` - ${age.years}v ${age.months}kk`}
            {/*
            {age &&
              ` - ${t('landing.ageYears', { count: age.years })} ${t('landing.ageMonths', { count: age.months })}`}
            */}
          </span>
          <h2
            className={styles['dependant-name']}
            data-testid={`dependant-name-${index}`}
          >
            {item.firstNames} {item.lastName}
          </h2>
        </div>
      </div>
      {canApply && (
        <div className={styles['application-card']}>
          <div className={styles['application-card-content']}>
            <h3 data-testid={`dependant-application-title-${index}`}>
              {t('landing.applicationTitle')}
            </h3>
            <p data-testid={`dependant-application-text-${index}`}>
              {t('landing.applicationDescription')}
            </p>
            <Button
              variant={ButtonVariant.Primary}
              data-testid={`btn-open-application-${index}`}
              disabled={openApplication.isPending}
              onClick={() =>
                openApplication.mutate({
                  path: { dependant_id: item.id },
                  query: { ssn: guardianSsn },
                })
              }
            >
              {t('landing.applicationLink')}
            </Button>
            {openApplication.isError && (
              <p
                role="alert"
                data-testid={`dependant-application-error-${index}`}
              >
                {openApplication.error.error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
