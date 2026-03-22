
import React from 'react';

interface NumericInputProps {
  label: string;
  name: string;
  value: number | '';
  onChange: (name: string, value: number | '') => void;
  placeholder?: string;
  className?: string;
  labelClass?: string;
  suffix?: string;
  max?: number;
}

const NumericInput: React.FC<NumericInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className,
  labelClass,
  suffix,
  max
}) => {
  // ฟังก์ชันจัดรูปแบบตัวเลขให้มี Commas
  const formatValue = (val: number | '') => {
    if (val === '') return '';
    return new Intl.NumberFormat('en-US').format(val);
  };

  // ฟังก์ชันจัดการตอนพิมพ์ (ลบ Comma ออกก่อนเซ็ต State)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '') {
      onChange(name, '');
      return;
    }
    let num = Number(rawValue);
    if (!isNaN(num)) {
      if (max !== undefined && num > max) {
        num = max;
      }
      onChange(name, num);
    }
  };

  return (
    <div className="w-full min-w-0">
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        <input
          type="text" // ใช้ text แทน number เพื่อให้แสดง Commas ได้
          name={name}
          value={formatValue(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className={className}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default NumericInput;
