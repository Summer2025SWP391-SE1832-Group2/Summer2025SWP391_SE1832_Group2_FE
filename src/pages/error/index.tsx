import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-gray-600">Trang bạn tìm không tồn tại.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Có thể đường dẫn đã bị thay đổi hoặc bạn đã nhập sai.
      </p>
      <Button className="mt-6" onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </div>
  );
};

export default NotFoundPage;
