export type vData = number | null;
export type IData = vData[];

export interface DataItem {
  value: vData;
  groupId: string;
}

export interface DrillDownGroup {
  dataGroupId: string;
  data: IData[];
}
