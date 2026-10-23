import { ApplicationFormStep } from '../ApplicationFormStep';
import { Divider } from '../../divider';
import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '../../markdown-content';

export const Alku = ({}) => {
  const { t } = useTranslation('lomake');

  return (
    <ApplicationFormStep data-testid="step-alku" title={t('alku.title')}>
      <MarkdownContent data-testid="text-alku-intro">
        {t('alku.introText')}
      </MarkdownContent>
      <Divider />
      <MarkdownContent data-testid="text-yksityinen-description">
        {t('alku.yksityinenDescription')}
      </MarkdownContent>
      <Divider />
    </ApplicationFormStep>
  );
};
