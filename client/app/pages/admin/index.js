import registerStatusPage from './status';
import registerOutdatedQueriesPage from './outdated-queries';
import registerTasksPage from './tasks';

export default function init(ngModule) {
  const routes = Object.assign(
    {}, registerStatusPage(ngModule),
    registerOutdatedQueriesPage(ngModule),
    registerTasksPage(ngModule),
  );
  return routes;
}
