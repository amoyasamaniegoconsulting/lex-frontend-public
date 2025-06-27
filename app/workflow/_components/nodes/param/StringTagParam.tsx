'use client';

import { useEffect, useId, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ParamProps } from '@/types/appNode';

export default function StringTagParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const id = useId();

  useEffect(() => {
    if (typeof value === 'string' && value.trim() !== '') {
      setTags(value.split(','));
    } else {
      setTags([]);
    }
  }, [value]);

  const addTag = (tag: string) => {
    if (tag.trim() !== '' && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      updateNodeParamValue(newTags.join(','));
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    updateNodeParamValue(newTags.join(','));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Input
        id={id}
        disabled={disabled}
        className="text-xs mt-1"
        value={inputValue}
        placeholder="Enter a tag and press Enter"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag, index) => (
          <Badge key={index} className="cursor-pointer mt-2" onClick={() => removeTag(index)}>
            {tag} ✕
          </Badge>
        ))}
      </div>
      {param.helperText && <p className="text-muted-foreground px-2">{param.helperText}</p>}
    </div>
  );
}
