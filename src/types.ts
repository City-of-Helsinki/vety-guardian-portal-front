import type React from 'react';
import type { FieldPath } from 'react-hook-form';
import type { PreschoolApplicationWritable } from './api/generated';

export type FormValues = PreschoolApplicationWritable & {
  h1SahkopostiConfirm?: string;
  h2SahkopostiConfirm?: string;
};
/*
export type FormValues = {
  appliedToPrivatePreschool: boolean;
  preschoolLanguage: 'fi' | 'sv';
  extendedCare: boolean;
  extendedCareStartDate: Date;
  extendedCareDetail: string;
};
*/

export type FormStep = {
  id: string;
  label: string;
  fields: FieldPath<FormValues>[];
  component: React.ComponentType;
};
