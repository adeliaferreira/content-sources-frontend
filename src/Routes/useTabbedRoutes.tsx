import { useMemo } from 'react';
import AdminTaskTable from '../Pages/AdminTaskTable/AdminTaskTable';
import ViewPayloadModal from '../Pages/AdminTaskTable/components/ViewPayloadModal/ViewPayloadModal';
import ContentListTable from '../Pages/ContentListTable/ContentListTable';
import AddContent from '../Pages/ContentListTable/components/AddContent/AddContent';
import EditContentModal from '../Pages/ContentListTable/components/EditContentModal/EditContentModal';
import DeleteContent from '../Pages/ContentListTable/components/DeleteContentModal/DeleteContent';
import PackageModal from '../Pages/ContentListTable/components/PackageModal/PackageModal';
import PopularRepositoriesTable from '../Pages/PopularRepositoriesTable/PopularRepositoriesTable';
import { useAppContext } from '../middleware/AppContext';
import SnapshotListModal from '../Pages/ContentListTable/components/SnapshotListModal/SnapshotListModal';

export const DEFAULT_ROUTE = '';
export const POPULAR_REPOSITORIES_ROUTE = 'popular-repositories';
export const ADMIN_TASKS_ROUTE = 'admin-tasks';

export type TabbedRoute = {
  title: string;
  route: string;
  Element: () => JSX.Element;
  ChildRoutes?: { path: string; Element: () => JSX.Element }[];
};

export default function useTabbedRoutes(): TabbedRoute[] {
  const { features, rbac } = useAppContext();
  const hasWrite = rbac?.write;

  // Wrap in a memo to prevent recalculation if values haven't changed.
  const tabs = useMemo(
    () => [
      {
        title: 'Your repositories',
        route: DEFAULT_ROUTE,
        Element: ContentListTable,
        ChildRoutes: [
          ...(hasWrite // These child routes are only permitted with rbac?.write access
            ? [
                { path: 'edit-repository', Element: EditContentModal },
                { path: 'add-repository', Element: AddContent },
                { path: 'delete-repository', Element: DeleteContent },
              ]
            : []),
          ...(features?.admintasks?.enabled && features.snapshots?.accessible
            ? [{ path: ':repoUUID/snapshots', Element: SnapshotListModal }]
            : []),
          { path: ':repoUUID/packages', Element: PackageModal },
        ],
      },
      {
        title: 'Popular repositories',
        route: POPULAR_REPOSITORIES_ROUTE,
        Element: PopularRepositoriesTable,
      },
      ...(features?.admintasks?.enabled && features.admintasks?.accessible
        ? [
            {
              title: 'Admin tasks',
              route: ADMIN_TASKS_ROUTE,
              Element: AdminTaskTable,
              ChildRoutes: [{ path: ':taskUUID', Element: ViewPayloadModal }],
            },
          ]
        : []),
    ],
    [hasWrite, features],
  );

  return tabs;
}
