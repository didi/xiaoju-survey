export type FilterItem = {
  comparator?: string;
  condition: Array<FilterCondition>;
};

export type FilterCondition = {
  field: string;
  comparator?: string;
  value: string & Array<FilterItem>;
};

export type OrderItem = {
  field: string;
  value: number;
};

export function getFilter(filterList: Array<FilterItem>) {
  const allowFilterField = [
    'title',
    'remark',
    'surveyType',
    'curStatus.status',
    'subStatus.status',
  ];
  return filterList.reduce(
    (preItem, curItem) => {
      const condition = curItem.condition
        .filter((item) => allowFilterField.includes(item.field))
        .reduce((pre, cur) => {
          switch (cur.comparator) {
            case '$ne':
              pre[cur.field] = {
                $ne: cur.value,
              };
              break;
            case '$regex':
              pre[cur.field] = {
                $regex: cur.value,
              };
              break;
            default:
              pre[cur.field] = cur.value;
              break;
          }
          return pre;
        }, {});
      switch (curItem.comparator) {
        case '$or':
          if (!Array.isArray(preItem.$or)) {
            preItem.$or = [];
          }
          preItem.$or.push(condition);
          break;
        default:
          Object.assign(preItem, condition);
          break;
      }
      return preItem;
    },
    {} as { $or?: Array<Record<string, string>> } & Record<string, string>,
  );
}

export function getOrder(order: Array<OrderItem>) {
  const allowOrderFields = ['createdAt', 'updatedAt', 'curStatus.date'];

  const orderList = order.filter((orderItem) =>
    allowOrderFields.includes(orderItem.field),
  );
  return orderList.reduce((pre, cur) => {
    pre[cur.field] = cur.value === 1 ? 1 : -1;
    return pre;
  }, {});
}
