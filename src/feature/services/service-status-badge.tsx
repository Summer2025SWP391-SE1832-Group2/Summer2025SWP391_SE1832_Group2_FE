import { Badge } from '@/components/ui/badge';

type ServiceStatusBadgeProps = {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
};

export const ServiceStatusBadge = ({
  isActive,
  activeText = 'Có',
  inactiveText = 'Không',
}: ServiceStatusBadgeProps) => (
  <Badge
    className={
      isActive
        ? 'text-green-700 bg-green-100 hover:bg-green-200'
        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
    }
  >
    {isActive ? activeText : inactiveText}
  </Badge>
);
