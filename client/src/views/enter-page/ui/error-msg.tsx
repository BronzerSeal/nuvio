const ErrorMsg = ({ error }: { error: string | undefined }) => {
  return <>{error && <p className="text-sm text-red-500">{error}</p>}</>;
};

export default ErrorMsg;
