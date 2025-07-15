
import { useEffect, useState } from "react";
import { getAllServices } from "@/services/services";
import type { ServiceResponse } from "@/types/services";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { paths } from "@/utils/constant/path";

const TestParameterPage = () => {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllServices();
      setServices(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Danh sách dịch vụ</h1>
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.serviceId} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-muted-foreground">{s.description}</p>
            </div>
            <Button onClick={() => navigate(paths.manager.testParameterDetail(s.serviceId))}>
              Chọn thông số
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestParameterPage;
