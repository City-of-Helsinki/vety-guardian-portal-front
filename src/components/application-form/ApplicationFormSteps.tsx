import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get, useFormContext } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { StepState, Stepper, Button, ButtonVariant } from 'hds-react';
import { type FormValues, type FormStep } from '../../types';
import styles from './ApplicationForm.module.css';
import { useNavigate } from 'react-router';
import { StepsContextProvider } from './StepsContext';
import { useApplicationData } from './ApplicationDataContext';

// Steps are filled up to the last one whose saved values say so, stopping at the first
// step that is known to be unfilled.
const filledStepIds = (steps: FormStep[], values: FormValues) => {
  const firstUnfilled = steps.findIndex(
    (step) => step.isFilled && !step.isFilled(values),
  );
  const candidates =
    firstUnfilled === -1 ? steps : steps.slice(0, firstUnfilled);
  const lastFilled = candidates.findLastIndex((step) =>
    step.isFilled?.(values),
  );
  return new Set(steps.slice(0, lastFilled + 1).map((step) => step.id));
};

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
  const application = useApplicationData();
  const [current, setCurrent] = useState(0);
  // Restore progress from the saved draft, so that e.g. the summary is reachable after logging in again.
  const [completed, setCompleted] = useState<Set<string>>(() =>
    filledStepIds(steps, application),
  );

  // A step can be opened once every step before it has been completed.
  const isReachable = (index: number, done = completed) =>
    steps.slice(0, index).every((step) => done.has(step.id));

  const stepperSteps = steps.map((step, i) => ({
    label: step.label,
    state:
      i === current
        ? StepState.available
        : completed.has(step.id)
          ? StepState.completed
          : isReachable(i)
            ? StepState.available
            : StepState.disabled,
  }));

  // Validates and saves the current step, then moves to the target step, or to the first
  // step that still needs filling if the change made later steps incomplete
  // (e.g. selecting extended care after it was previously declined).
  const saveAndGoTo = async (index: number) => {
    const valid = await trigger(steps[current].fields);
    if (!valid) return;
    const values = getValues();
    const saved = await onStepSave(values, form);
    if (!saved) return;
    const done = new Set(completed).add(steps[current].id);
    steps.forEach((step, i) => {
      if (i !== current && step.isFilled && !step.isFilled(values)) {
        done.delete(step.id);
      }
    });
    setCompleted(done);
    const firstUnreachable = steps.findIndex((_, i) => !isReachable(i, done));
    setCurrent(
      firstUnreachable === -1 ? index : Math.min(index, firstUnreachable - 1),
    );
  };

  const next = () => saveAndGoTo(current + 1);

  const goTo = (_e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (index < current) {
      setCurrent(index);
      return;
    }
    if (index > current && isReachable(index)) void saveAndGoTo(index);
  };

  const goToStep = (id: string) => {
    const index = steps.findIndex((s) => s.id === id);
    // allow only backwards
    if (index === -1 || index > current) return;
    setCurrent(index);
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
      <StepsContextProvider value={{ goToStep, currentId: steps[current].id }}>
        <Stepper
          data-testid="stepper"
          steps={stepperSteps}
          language={i18n.language}
          selectedStep={current}
          onStepClick={goTo}
        />

        <ActiveStep />

        {errors.root?.server && (
          <p role="alert" data-testid="error-server">
            {errors.root.server.message}
          </p>
        )}

        <div className={styles['stepper-buttons']}>
          <Button
            variant={ButtonVariant.Secondary}
            data-testid="btn-previous"
            onClick={
              current === 0
                ? () => navigate('/')
                : () => setCurrent((i) => i - 1)
            }
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            {t('previousPage')}
          </Button>
          {isLast ? (
            <Button
              variant={ButtonVariant.Primary}
              type="submit"
              data-testid="btn-submit"
              disabled={isSaving}
              style={{ height: 'fit-content', width: 'fit-content' }}
            >
              {t('sendApplication')}
            </Button>
          ) : (
            <Button
              variant={ButtonVariant.Secondary}
              onClick={next}
              data-testid="btn-next"
              disabled={isSaving}
              style={{ height: 'fit-content', width: 'fit-content' }}
            >
              {t('nextPage')}
            </Button>
          )}
        </div>
      </StepsContextProvider>
    </div>
  );
};
