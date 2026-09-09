import type React from 'react';
import type { FieldPath } from 'react-hook-form';

export type Dependant = {
  id: number;
  nimi: string;
};

export type FormValues = {
  appliedToPrivatePreschool: boolean;
  preschoolLanguage: 'fi' | 'sv';
};

export type FormStep = {
  id: string;
  label: string;
  fields: FieldPath<FormValues>[];
  component: React.ComponentType;
};
