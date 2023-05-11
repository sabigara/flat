import { DefaultErrorBoundary } from "@/src/app/error/components/DefaultErrorBoundary";
import PostRoute from "@/src/app/post/routes/PostRoute/PostRoute";

export const element = <PostRoute />;
export const errorElement = <DefaultErrorBoundary />;
