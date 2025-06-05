export type User = {
    userId: number;
    fullName: string;
    email: string;
    phone: string | null;
    passwordHash: string;
    role: "Staff" | "Admin" | "Customer" | string; // hoặc thay đổi theo role bạn dùng
    gender: "male" | "female" | string;
    dateOfBirth: string; // hoặc `Date` nếu bạn convert khi nhận
  };
  