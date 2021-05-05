import { SearchParameterBase } from '@core/models';

export function controllerPaginationHelper(query: qs.ParsedQs): SearchParameterBase {
  return {
    offset: query.offset ?
      (parseInt(query.offset as string, 10) * (parseInt(query.limit as string || '10', 10))) : 0,
    orderBy: query.orderBy as string || 'createdAt',
    isDESC: query.isDESC === 'true',
    limit: Math.min(parseInt(query.limit as string || '10', 10), 100),
  };
}