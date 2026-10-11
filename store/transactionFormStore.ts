import { create } from 'zustand';

interface TransactionFormState {
  isValid: boolean;
  isDirty: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  submitHandler: (() => Promise<void>) | null;
  setFormState: (state: { isValid: boolean; isDirty: boolean; isEditing: boolean }) => void;
  setSubmitHandler: (handler: (() => Promise<void>) | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetFormState: () => void;
}

export const useTransactionFormStore = create<TransactionFormState>((set) => ({
  isValid: false,
  isDirty: false,
  isEditing: false,
  isSubmitting: false,
  submitHandler: null,
  setFormState: ({ isValid, isDirty, isEditing }) => set({ isValid, isDirty, isEditing }),
  setSubmitHandler: (submitHandler) => set({ submitHandler }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  resetFormState: () => set({ 
    isValid: false, 
    isDirty: false, 
    isEditing: false, 
    isSubmitting: false, 
    submitHandler: null 
  }),
}));
