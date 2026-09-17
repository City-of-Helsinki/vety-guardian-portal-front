import styles from './ApplicationForm.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type React from 'react';
import type { FormValues } from '../../types';

interface ApplicationFormProps {
  defaultValues: FormValues;
  onSubmit: (values: FormValues, form: UseFormReturn<FormValues>) => void;
  children?: React.ReactNode;
}

export const ApplicationForm = ({
  defaultValues,
  onSubmit,
  children,
}: ApplicationFormProps) => {
  const methods = useForm<FormValues>({ defaultValues, mode: 'onTouched' });

  return (
    <div className={styles.container}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((values) => onSubmit(values, methods))}
          className={styles.form}
          noValidate
        >
          {children}
        </form>
      </FormProvider>
    </div>
  );
};
