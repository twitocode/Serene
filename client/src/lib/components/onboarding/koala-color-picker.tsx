'use client';

import {
  ColorPicker,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from '@/components/ui/shadcn-io/color-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface KoalaColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function KoalaColorPicker({ value, onChange, className }: KoalaColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ backgroundColor: value || '#5EEAD4' }}
            />
            <span>{value || 'Select color'}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <ColorPicker value={value || '#5EEAD4'} onChange={onChange}>
          <ColorPickerSelection className="h-32 mb-4" />
          <ColorPickerHue className="mb-4" />
          <ColorPickerFormat />
        </ColorPicker>
      </PopoverContent>
    </Popover>
  );
}
