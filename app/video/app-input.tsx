import React from "react";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (value: string, name: string) => void;
  name?: string;
}

const AppInput: React.FC<InputProps> = (props) => {
  const { label, value, onChange, name } = props;

  return (
    <div className="flex-col justify-start mt-6">
      <div>
        <label
          className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          htmlFor="inline-full-name"
        >
          {label}
        </label>
      </div>
      <div>
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          name={name}
          value={value}
          {...(onChange &&
            name && {
              onChange: (e) => onChange(e.target.value, name),
            })}
        />
      </div>
    </div>
  );
};

export default AppInput;
