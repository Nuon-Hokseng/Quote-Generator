import * as React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-gradient-to-r from-teal-400 to-blue-700 
      text-white rounded-full px-8 py-3 text-base font-semibold shadow-md
      hover:scale-95 active:scale-95 transition-transform duration-100 outline-none
      focus:ring-2 focus:ring-teal-400
      ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}
    `}
    type="button"
  >
    {children}
  </button>
);

export default Button;
