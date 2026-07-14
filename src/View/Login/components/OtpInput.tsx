import React, { useEffect, useRef, useState } from 'react';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, value, onChange, disabled }) => {
  const [digits, setDigits] = useState<string[]>(() => Array.from({ length }, (_, i) => value[i] || ''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Allow the parent to reset the boxes (e.g. on resend / go back) by clearing `value`.
  useEffect(() => {
    if (value === '') {
      setDigits(Array.from({ length }, () => ''));
    }
  }, [value, length]);

  const updateDigits = (next: string[]) => {
    setDigits(next);
    onChange(next.join(''));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    updateDigits(next);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      updateDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    updateDigits(Array.from({ length }, (_, i) => pasted[i] || ''));
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-full aspect-square max-w-12 text-center text-lg font-bold rounded-xl border-2 border-border bg-bg-soft focus:outline-none focus:border-primary focus:bg-white transition-colors disabled:opacity-50"
        />
      ))}
    </div>
  );
};

export default OtpInput;
