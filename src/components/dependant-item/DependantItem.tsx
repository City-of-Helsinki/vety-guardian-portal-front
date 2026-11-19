import type {
  Dependant,
  PreschoolApplicationFormForDependantCreateError,
  PreschoolApplicationFormForDependantCreateResponse,
} from '../../api/generated';
import { preschoolApplicationFormForDependantCreate } from '../../api/generated';
import { DependantIcon } from '../dependant-icon';
import { PdfDownloadButton } from '../pdf-download-button';
import styles from './DependantItem.module.css';
import { Button, ButtonVariant, Notification } from 'hds-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ageFromIso, isoToDisplay } from '../../utils/date';
import { MarkdownContent } from '../markdown-content';

interface DependantItemProps {
  item: Dependant;
  // Position in the dependant list, used only for data-testids.
  index: number;
  canApply: boolean;
  // The child is of preschool age but their home municipality isn't Helsinki. A child of the wrong age
  // gets no explanation on purpose.
  notResidentHelsinki: boolean;
}

export const DependantItem = ({
  item,
  index,
  canApply,
  notResidentHelsinki,
}: DependantItemProps) => {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();

  const application = useQuery<
    PreschoolApplicationFormForDependantCreateResponse,
    PreschoolApplicationFormForDependantCreateError
  >({
    queryKey: ['preschoolApplicationFormForDependant', item.id],
    queryFn: async () => {
      const { data } = await preschoolApplicationFormForDependantCreate({
        path: { dependant_id: item.id },
        throwOnError: true,
      });
      return data;
    },
    enabled: canApply,
    retry: false,
  });

  const isSubmitted = application.data?.status === 'submitted';

  const age = ageFromIso(item.dateOfBirth);
  const unknownError = t(
    'errors.unknown',
    'Tapahtui virhe. Yritä myöhemmin uudelleen.',
  );

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
              {t('applicationTitle')}
            </h3>
            <MarkdownContent
              data-testid={`dependant-application-text-${index}`}
            >
              {t('applicationDescription')}
            </MarkdownContent>
            <Button
              variant={ButtonVariant.Primary}
              data-testid={`btn-open-application-${index}`}
              disabled={!application.isSuccess}
              onClick={() =>
                application.data &&
                navigate(`/application/${application.data.id}`)
              }
            >
              {isSubmitted ? t('applicationProcessing') : t('applicationLink')}
            </Button>
            {isSubmitted && application.data && (
              <div className={styles['pdf-download']}>
                <PdfDownloadButton
                  application={application.data}
                  data-testid={`btn-download-pdf-${index}`}
                />
              </div>
            )}
            {application.isError && (
              <p
                role="alert"
                data-testid={`dependant-application-error-${index}`}
              >
                {/* The backend's `code` is translated in Locize; `error` is only for developers. */}
                {application.error.code
                  ? t(`errors.${application.error.code}`, unknownError)
                  : unknownError}
              </p>
            )}
          </div>
        </div>
      )}
      {notResidentHelsinki && (
        <Notification
          type="info"
          label={t('eligibility.notResidentHelsinki')}
          data-testid={`notification-not-resident-helsinki-${index}`}
        />
      )}
    </div>
  );
};
