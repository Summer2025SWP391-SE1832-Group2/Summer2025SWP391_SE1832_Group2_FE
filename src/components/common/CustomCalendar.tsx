import * as React from 'react'
import { format, parse, isValid } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { buttonVariants, Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { DayPicker, type DropdownProps, type DayPickerSingleProps } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CustomDropdown = React.memo(function CustomDropdown({
  value,
  onChange,
  children,
}: DropdownProps) {
  const options = React.Children.toArray(children) as React.ReactElement<
    React.HTMLProps<HTMLOptionElement>
  >[]

  const selected = options.find((child) => child.props.value === value)

  const handleChange = React.useCallback(
    (val: string) => {
      const changeEvent = {
        target: { value: val },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange?.(changeEvent)
    },
    [onChange]
  )

  return (
    <Select value={value?.toString()} onValueChange={handleChange}>
      <SelectTrigger className="pr-1.5 focus:ring-0">
        <SelectValue>{selected?.props?.children}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        <ScrollArea className="h-40">
          {options.map((option, idx) => (
            <SelectItem key={`${option.props.value}-${idx}`} value={option.props.value?.toString() ?? ''}>
              {option.props.children}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  )
})

export function CustomCalendar({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  fromYear = 1950,
  toYear = new Date().getFullYear(),
  disabled,
  dateFormat = 'dd/MM/yyyy',
  locale = vi,
}: {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  fromYear?: number
  toYear?: number
  disabled?: DayPickerSingleProps['disabled']
  dateFormat?: string
  locale?: Locale
}) {
  const [inputValue, setInputValue] = React.useState(value ? format(value, dateFormat, { locale }) : '')
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, dateFormat, { locale }))
    } else {
      setInputValue('')
    }
  }, [value, dateFormat, locale])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    const parsedDate = parse(val, dateFormat, new Date(), { locale })
    if (isValid(parsedDate)) {
      // Check disabled range
      if (
        disabled &&
        ((typeof disabled === 'function' && disabled(parsedDate)))
      ) {
        onChange?.(undefined)
        return
      }
      onChange?.(parsedDate)
    } else {
      onChange?.(undefined)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          spellCheck={false}
          autoComplete="off"
        />
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-label="Open calendar"
            className="min-w-[2.5rem] p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <DayPicker
          mode="single"
          showOutsideDays
          captionLayout="dropdown"
          selected={value}
          onSelect={(d) => {
            if (d) {
              onChange?.(d)
              setIsOpen(false)
            }
          }}
          fromYear={fromYear}
          toYear={toYear}
          disabled={disabled}
          className="p-3"
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex flex-col items-center pt-1 relative',
            caption_label: 'text-sm font-medium hidden',
            caption_dropdowns: 'flex justify-center items-center gap-2 w-full ',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: cn(
              buttonVariants({ variant: 'ghost' }),
              'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
            ),
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
          components={{
            Dropdown: CustomDropdown,
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </PopoverContent>
    </Popover>
  )
}