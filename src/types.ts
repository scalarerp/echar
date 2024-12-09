export type vData = number | null;
export type IData = [number, vData];

export interface IDailyData {
  value: vData; 
  groupId: string;
}


export interface IMonthlyData {
  dataGroupId: string
  value: vData; 
  children: IDailyData[]; 
}
