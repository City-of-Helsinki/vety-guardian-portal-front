import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get, useFormContext } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { StepState, Stepper, Button, ButtonVariant } from 'hds-react';
import { type FormValues, type FormStep } from '../../types';
import styles from './ApplicationForm.module.css';
import { useNavigate } from 'react-router';

interface ApplicationFormStepsProps {
  steps: FormStep[];
  onStepSave: (
    values: FormValues,
    form: UseFormReturn<FormValues>,
  ) => Promise<boolean>;
  isSaving?: boolean;
}

export const ApplicationFormSteps = ({
  steps,
  onStepSave,
  isSaving = false,
}: ApplicationFormStepsProps) => {
  const { i18n, t } = useTranslation('lomake');
  const navigate = useNavigate();
  const form = useFormContext<FormValues>();
  const {
    trigger,
    getValues,
    formState: { errors },
  } = form;
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
    const saved = await onStepSave(getValues(), form);
    if (!saved) return;
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

  // If the backend returns field errors upon submission, then navigate to the first page containing errors.
  const serverErrorStep = steps.findIndex((step) =>
    step.fields.some((field) => get(errors, field)?.type === 'server'),
  );
  const [prevServerErrorStep, setPrevServerErrorStep] = useState(-1);
  if (serverErrorStep !== prevServerErrorStep) {
    setPrevServerErrorStep(serverErrorStep);
    if (serverErrorStep !== -1 && serverErrorStep < current) {
      setCurrent(serverErrorStep);
    }
  }

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

      {errors.root?.server && <p role="alert">{errors.root.server.message}</p>}

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
            disabled={isSaving}
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            {t('sendApplication')}
          </Button>
        ) : (
          <Button
            variant={ButtonVariant.Secondary}
            onClick={next}
            disabled={isSaving}
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            {t('nextPage')}
          </Button>
        )}
      </div>
    </div>
  );
};
