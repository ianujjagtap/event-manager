"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/primitives/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
import { Button } from "./button";
import { ScrollArea } from "./scrollarea";

export interface ComboboxItem {
  value: string;
  name: string;
  isColor?: boolean;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No item found.",
  searchPlaceholder = "Search...",
  className,
  buttonClassName,
  popoverClassName,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal md:text-sm",
              buttonClassName
            )}
            disabled={disabled}
          >
            {value
              ? items?.find((item) => item.value === value)?.name
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", popoverClassName)}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <ScrollArea className="h-48">
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {items?.map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div key={index}>
                      <CommandItem
                        value={item.name}
                        onSelect={(currentValue) => {
                          const selectedItem = items.find(
                            (i) =>
                              i.name.toLowerCase() ===
                              currentValue.toLowerCase()
                          );
                          onChange(selectedItem ? selectedItem.value : "");
                          setOpen(false);
                        }}
                      >
                        {item.isColor && (
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: item.name }}
                          />
                        )}
                        {item.name}
                      </CommandItem>
                    </div>
                  ))}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
