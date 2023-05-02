import { Spinner } from "@camome/core/Spinner";

export function isButtonLoading(loading: boolean) {
  if (loading) {
    return {
      startDecorator: <Spinner size="sm" />,
      disabled: true,
    };
  } else {
    return {};
  }
}
