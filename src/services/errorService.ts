export const getBackendErrorMessage = (error: any): string => {
  return (
    // error?.config ||
    // error?.response?.data?.details?.details ||
    error?.response?.data?.message ||
    "خطای نامشخصی رخ داد"
  );
};
