
 type UserWorkSchedule = {
    userWorkScheduleId: number;
    userId: number;
    workScheduleId: number;
    date: string;        
  }
  type scheduleUser ={
    userWorkScheduleId: number;
    userId: number;
    title : string;
    workScheduleId: number;
    date: string;        
  }
export type { UserWorkSchedule, scheduleUser};
  