import * as React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  formAction?: string | ((formData: FormData) => Promise<void>);
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  formAction,
  type = "button",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    formAction={formAction}
    className={`
      bg-gradient-to-r from-yellow-400 to-red-500
      text-white rounded-full px-8 py-3 text-base font-semibold shadow-md
      hover:scale-95 active:scale-95 transition-transform duration-100 outline-none
      focus:ring-2 focus:ring-teal-400
      ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}
    `}
    type={type}
  >
    {children}
  </button>
);

export default Button;
