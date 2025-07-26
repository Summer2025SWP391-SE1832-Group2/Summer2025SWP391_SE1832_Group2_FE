import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface Transaction {
  id: string;
  userName: string;
  serviceName: string;
  amount: number;
  status: "PAID" | "REFUNDED";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "TXN001",
    userName: "Nguyễn Văn A",
    serviceName: "Xét nghiệm ADN cha con",
    amount: 2000000,
    status: "PAID",
    date: "2025-07-24",
  },
  {
    id: "TXN002",
    userName: "Trần Thị B",
    serviceName: "Xét nghiệm huyết thống",
    amount: 1500000,
    status: "REFUNDED",
    date: "2025-07-23",
  },
];

export default function TransactionTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Dịch vụ</TableHead>
          <TableHead>Ngày</TableHead>
          <TableHead>Số tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txn) => (
          <TableRow key={txn.id}>
            <TableCell>{txn.id}</TableCell>
            <TableCell>{txn.userName}</TableCell>
            <TableCell>{txn.serviceName}</TableCell>
            <TableCell>{format(new Date(txn.date), "dd/MM/yyyy")}</TableCell>
            <TableCell>{txn.amount.toLocaleString()}đ</TableCell>
            <TableCell>
              <span className={txn.status === "PAID" ? "text-green-600" : "text-red-500"}>
                {txn.status === "PAID" ? "Đã thanh toán" : "Đã hoàn tiền"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}