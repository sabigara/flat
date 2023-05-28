import { Box } from "@camome/core/Box";

import { createPolymorphicComponent } from "@/src/lib/createPolymorphicComponent";

type WrapIfProps = {
  component: any;
  condition: boolean;
  children: React.ReactNode;
};

function _WrapIf({ component, condition, children, ...props }: WrapIfProps) {
  if (!condition) return children;
  return (
    <Box component={component} {...props}>
      {children}
    </Box>
  );
}

export const WrapIf = createPolymorphicComponent<"div", WrapIfProps>(_WrapIf);
