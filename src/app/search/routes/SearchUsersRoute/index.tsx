import { DefaultErrorBoundary } from "@/src/app/error/components/DefaultErrorBoundary";
import { SearchUsersRoute } from "@/src/app/search/routes/SearchUsersRoute/SearchUsersRoute";

export const element = <SearchUsersRoute />;
export const errorElement = <DefaultErrorBoundary />;
