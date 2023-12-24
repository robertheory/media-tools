import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { VIDEO_FORMATS } from '@/data/formats'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const TypeSelector = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<keyof VIDEO_FORMATS | null>(null)

  const allTypes = Object.keys(VIDEO_FORMATS)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? allTypes.find((type) => type === value) : 'Select format...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {allTypes.map((type) => (
              <CommandItem
                key={type}
                value={type}
                onSelect={() => {
                  setValue(value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === type ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {type}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TypeSelector
