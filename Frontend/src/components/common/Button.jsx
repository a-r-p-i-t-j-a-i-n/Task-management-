const Button = ({ children, onClick, type = "button", variant = "primary", className = "", disabled=false }) => {
  const baseStyle = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 focus:ring-indigo-500 shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200 shadow-sm hover:shadow",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-md hover:shadow-lg",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-md hover:shadow-lg"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
