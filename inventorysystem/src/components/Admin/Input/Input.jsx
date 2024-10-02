import React from "react";
import PropTypes from "prop-types";

function Input({
  btnType,
  placeholder,
  onChange,
  className,
  btnValue,
  btnName,
  ...rest
}) {
  return (
    <div className="mb-4">
    <input
      type={btnType}
      placeholder={placeholder}
      onChange={onChange}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 
                  hover:border-blue-400 transition-colors duration-300 ease-in-out ${className}`}
      value={btnValue || ''}
      name={btnName}
      {...rest}
    />
  </div>
  );
}



export default Input;
