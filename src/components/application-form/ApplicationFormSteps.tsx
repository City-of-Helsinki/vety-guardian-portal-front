import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StepState, Stepper, Button, ButtonVariant } from 'hds-react';
import { type FormValues, type FormStep } from '../../types';
import styles from './ApplicationForm.module.css';
import { useNavigate } from 'react-router';

interface ApplicationFormStepsProps {
  steps: FormStep[];
}

export const ApplicationFormSteps = ({ steps }: ApplicationFormStepsProps) => {
  const { i18n, t } = useTranslation('lomake');
  const navigate = useNavigate();
  const { trigger } = useFormContext<FormValues>();
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const stepperSteps = steps.map((step, i) => ({
    label: step.label,
    state:
      i === current
        ? StepState.available
        : completed.has(step.id)
          ? StepState.completed
          : StepState.disabled,
  }));

  const next = async () => {
    const valid = await trigger(steps[current].fields);
    if (!valid) return;
    setCompleted((prev) => new Set(prev).add(steps[current].id));
    setCurrent((i) => i + 1);
  };

  const goTo = (_e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (index < current) {
      setCurrent(index);
      return;
    }
    if (completed.has(steps[index - 1]?.id)) setCurrent(index);
  };

  const ActiveStep = steps[current].component;
  const isLast = current === steps.length - 1;

  return (
    <div>
      <Stepper
        steps={stepperSteps}
        language={i18n.language}
        selectedStep={current}
        onStepClick={goTo}
      />

      <ActiveStep />

      <div className={styles['stepper-buttons']}>
        <Button
          variant={ButtonVariant.Secondary}
          onClick={
            current === 0 ? () => navigate('/') : () => setCurrent((i) => i - 1)
          }
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          {t('previousPage')}
        </Button>
        {isLast ? (
          <Button
            variant={ButtonVariant.Primary}
            type="submit"
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            {t('sendApplication')}
          </Button>
        ) : (
          <Button
            variant={ButtonVariant.Secondary}
            onClick={next}
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            {t('nextPage')}
          </Button>
        )}
      </div>
    </div>
  );
};
