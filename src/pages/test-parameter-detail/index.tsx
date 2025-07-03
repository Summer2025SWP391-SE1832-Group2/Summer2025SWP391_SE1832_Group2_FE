import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";
import { getTestParametersByServiceId, createTestParameter, deleteTestParameter } from "@/services/test_parameters-service";
import { getAllParameters } from "@/services/parameters-service";
import type { TestParameter, Parameter } from "@/types/testparameters";

const TestParameterDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [allParameters, setAllParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedParamId, setSelectedParamId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const { showToast } = useToast();

  const fetchTestParameters = async () => {
    if (!serviceId) return;
    showToast("Đang tải thông số...", "loading");
    try {
      const data = await getTestParametersByServiceId(Number(serviceId));
      setTestParameters(data);
      showToast("Tải thông số thành công!", "success");
    } catch {
      showToast("Không thể tải thông số.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllParameters = async () => {
    try {
      const data = await getAllParameters();
      setAllParameters(data);
    } catch {
      showToast("Không thể tải danh sách chỉ số.", "error");
    }
  };

  useEffect(() => {
    fetchTestParameters();
    fetchAllParameters();
  }, [serviceId]);

  const handleAdd = async () => {
    if (!serviceId || !selectedParamId) return;
    try {
      setAdding(true);
      showToast("Đang thêm thông số...", "loading");
      await createTestParameter({
        testParameterId: 0,
        serviceId: Number(serviceId),
        parameterId: selectedParamId,
        displayOrder: 0,
      });
      await fetchTestParameters();
      setSelectedParamId(null);
      showToast("Thêm thông số thành công!", "success");
    } catch {
      showToast("Không thể thêm thông số.", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      showToast("Đang xoá thông số...", "loading");
      await deleteTestParameter(id);
      await fetchTestParameters();
      showToast("Đã xoá thông số thành công!", "success");
    } catch {
      showToast("Không thể xoá thông số.", "error");
    }
  };

  const filteredParameters = allParameters.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Thông số của dịch vụ ID: {serviceId}</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="secondary">+ Thêm thông số</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm thông số</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Tìm kiếm chỉ số..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
            {filteredParameters.map((param) => (
              <div
                key={param.parameterId}
                className={`p-2 rounded border flex justify-between items-center cursor-pointer ${selectedParamId === param.parameterId ? "bg-muted" : ""}`}
                onClick={() => setSelectedParamId(param.parameterId)}
              >
                <div>
                  <p className="font-medium">{param.name}</p>
                  <p className="text-muted-foreground text-sm">{param.description}</p>
                </div>
                {selectedParamId === param.parameterId && <span className="text-primary text-sm">Đã chọn</span>}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={handleAdd} disabled={!selectedParamId || adding}>
              {adding ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : testParameters.length === 0 ? (
        <p>Không có thông số nào.</p>
      ) : (
        <div className="rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Tên chỉ số</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-end">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testParameters.map((param) => (
                <TableRow key={param.testParameterId}>
                  <TableCell>{param.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{param.description}</TableCell>
                  <TableCell className="text-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Xoá
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc muốn xoá thông số này?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Huỷ</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(param.testParameterId)}>
                            Xác nhận
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TestParameterDetailPage;
