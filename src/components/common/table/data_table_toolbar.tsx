import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReactTable } from '@tanstack/react-table';
import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface DataTableToolbarProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  searchKey?: string;
  searchPlaceholder?: string;
  filterKey?: string;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Search...',
  filterKey,
  filterOptions = [],
  filterPlaceholder = 'Filter...',
}: DataTableToolbarProps<TData>) {
  // Get the column to filter by searchKey
  const searchColumn = searchKey ? table.getColumn(searchKey) : null;
  const filterColumn = filterKey ? table.getColumn(filterKey) : null;

  const handleSearchChange = (value: string) => {
    searchColumn?.setFilterValue(value);
  };

  const handleFilterChange = (value: string) => {
    filterColumn?.setFilterValue(value);
  };

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* Search Input */}
        {searchKey && searchColumn && (
          <div className='relative w-full md:w-auto lg:w-72'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder={searchPlaceholder}
              value={(searchColumn.getFilterValue() as string) ?? ''}
              onChange={(event) => handleSearchChange(event.target.value)}
              className='h-10 w-full pl-8 md:w-[240px] lg:w-[280px]'
            />
          </div>
        )}

        {/* Dynamic Filter Dropdown */}
        {filterKey && filterColumn && filterOptions.length > 0 && (
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={filterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
