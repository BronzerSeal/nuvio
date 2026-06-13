const ErrorMsg = ({
  error,
  className,
}: {
  error: string | undefined;
  className?: string;
}) => {
  return (
    <>
      {error && <p className={`text-sm text-red-500 ${className}`}>{error}</p>}
    </>
  );
};

export default ErrorMsg;
