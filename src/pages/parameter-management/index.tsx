import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Parameter } from "@/types/testparameters";
import {
    createParameter,
    deleteParameter,
    getAllParameters,
} from "@/services/parameters-service";
import { useToast } from "@/components/ui/toast";

const ParameterPage = () => {
    const [parameters, setParameters] = useState<Parameter[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [newName, setNewName] = useState("");
    const [newUnit, setNewUnit] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const { showToast } = useToast();


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchParameters = async () => {
        showToast("Đang tải chỉ số...", "loading");
        try {
            const data = await getAllParameters();
            setParameters(data.reverse());
            showToast("Tải chỉ số thành công", "success");
        } catch {
            showToast("Không thể tải chỉ số.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParameters();
    }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;

        try {
            setCreating(true);
            showToast("Đang tạo chỉ số...", "loading");

            await createParameter({
                name: newName,
                unit: newUnit || "N/A",
                description: newDescription,
            });

            await fetchParameters();

            setNewName("");
            setNewUnit("");
            setNewDescription("");

            showToast("Đã tạo chỉ số thành công!", "success");
        } catch {
            showToast("Không thể tạo chỉ số.", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            showToast("Đang xoá chỉ số...", "loading");
            await deleteParameter(id);
            await fetchParameters();
            showToast("Đã xoá chỉ số thành công!", "success");
        } catch {
            showToast("Không thể xoá chỉ số.", "error");
        }
    };

    // Tính toán dữ liệu theo trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = parameters.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(parameters.length / itemsPerPage);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý Chỉ số</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"} size="sm">+ Thêm Chỉ số</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo chỉ số mới</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreate();
                            }}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Tên chỉ số"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Input
                                placeholder="Đơn vị"
                                value={newUnit}
                                onChange={(e) => setNewUnit(e.target.value)}
                                hidden
                            />
                            <Input
                                placeholder="Mô tả"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={creating}>
                                    {creating ? "Đang tạo..." : "Tạo"}
                                </Button>
                            </DialogFooter>
                        </form>

                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : parameters.length === 0 ? (
                <p>Không có chỉ số nào.</p>
            ) : (
                <div className="space-y-4">
                    <div className="rounded-xl border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/4">Tên Chỉ số</TableHead>
                                    <TableHead className="w-1/2">Mô tả</TableHead>
                                    <TableHead className="text-end">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((param) => (
                                    <TableRow key={param.parameterId}>
                                        <TableCell>{param.name}</TableCell>
                                        <TableCell>{param.description}</TableCell>
                                        <TableCell className="text-end">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">
                                                        Xoá
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Bạn có chắc muốn xoá chỉ số này không?
                                                        </AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(param.parameterId)}
                                                        >
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

                    {/* Phân trang */}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Trang trước
                        </Button>
                        <span className="text-sm flex items-center">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                        >
                            Trang sau
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParameterPage;
