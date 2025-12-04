"use client";

import { ChangeEvent, useEffect, useState } from "react";

type UseCharacterLimitProps = {
  maxLength: number;
  initialValue?: string;
};

export function useCharacterLimit({ maxLength, initialValue = "" }: UseCharacterLimitProps) {
  const [value, setValue] = useState(initialValue);
  const [characterCount, setCharacterCount] = useState(initialValue.length);
  const [hasBeenSet, setHasBeenSet] = useState(false);

  useEffect(() => {
    if (!hasBeenSet && initialValue) {
      setValue(initialValue);
      setCharacterCount(initialValue.length);
      setHasBeenSet(true);
    }
  }, [initialValue, hasBeenSet]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
      setCharacterCount(newValue.length);
    }
  };

  const setValueWithCount = (newValue: string) => {
    const trimmedValue = newValue.length <= maxLength ? newValue : newValue.slice(0, maxLength);
    setValue(trimmedValue);
    setCharacterCount(trimmedValue.length);
    setHasBeenSet(true);
  };

  return {
    value,
    characterCount,
    handleChange,
    maxLength,
    setValue: setValueWithCount,
  };
}

