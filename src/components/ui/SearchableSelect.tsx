import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

export type SelectOption = {
  id: string;
  label: string;
  keywords?: string[];
};

type SearchableSelectProps = {
  id: string;
  placeholder: string;
  options: SelectOption[];
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
  multiple?: boolean;
  emptyText?: string;
};

function normalizeText(text: string) {
  return text
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function SearchableSelect({
  id,
  placeholder,
  options,
  selectedIds,
  onChange,
  multiple = false,
  emptyText = "Sonuc bulunamadi",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) {
        return;
      }

      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedSet.has(option.id)),
    [options, selectedSet]
  );

  const filteredOptions = useMemo(() => {
    const query = normalizeText(searchText.trim());
    if (!query) {
      return options;
    }

    return options.filter((option) => {
      const haystack = [option.label, ...(option.keywords ?? [])]
        .join(" ")
        .trim();
      return normalizeText(haystack).includes(query);
    });
  }, [options, searchText]);

  const selectionPreview = useMemo(() => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    const labels = selectedOptions.map((item) => item.label);
    const previewLimit = 2;

    if (labels.length <= previewLimit) {
      return labels.join(", ");
    }

    const hiddenCount = labels.length - previewLimit;
    return `${labels.slice(0, previewLimit).join(", ")} +${hiddenCount}...`;
  }, [placeholder, selectedOptions]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchText, isOpen]);

  const handleToggleOption = (optionId: string) => {
    if (!multiple) {
      onChange([optionId]);
      setIsOpen(false);
      setSearchText("");
      return;
    }

    if (selectedSet.has(optionId)) {
      onChange(selectedIds.filter((id) => id !== optionId));
      return;
    }

    onChange([...selectedIds, optionId]);
    setSearchText("");
  };

  const openAndFocus = () => {
    setIsOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "Enter")) {
      event.preventDefault();
      openAndFocus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        Math.min(current + 1, Math.max(filteredOptions.length - 1, 0))
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) {
        handleToggleOption(option.id);
      }
      return;
    }

    if (event.key === "Backspace" && !searchText && multiple && selectedIds.length > 0) {
      onChange(selectedIds.slice(0, -1));
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        className="input-base flex min-h-11 cursor-text items-center gap-2 overflow-hidden px-2 py-2"
        onClick={openAndFocus}
      >
        {isOpen ? (
          <input
            ref={searchInputRef}
            type="text"
            value={searchText}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setSearchText(event.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Yazarak ara..."
            className="min-w-[90px] flex-1 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        ) : (
          <span className={selectedOptions.length === 0 ? "flex-1 truncate text-sm text-slate-400" : "flex-1 truncate text-sm text-slate-800"}>
            {selectionPreview}
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen((current) => !current);
            if (!isOpen) {
              openAndFocus();
            }
          }}
          className={`ml-auto text-xs text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
          aria-label="Secenekleri ac"
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <div id={`${id}-menu`} className="surface-glass absolute left-0 top-[calc(100%+8px)] z-30 w-full rounded-2xl p-3">
          <div className="mb-2 flex items-center justify-between px-1 text-xs text-slate-500">
            <span>{selectedOptions.length} secili</span>
            {selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="font-semibold text-orange-700 transition hover:text-orange-800"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const selected = selectedSet.has(option.id);
                const highlighted = index === highlightedIndex;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggleOption(option.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition duration-300 ${
                      selected
                        ? "bg-orange-100 text-orange-800"
                        : highlighted
                          ? "bg-slate-100 text-slate-800"
                          : "bg-white/70 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                          selected
                            ? "border-orange-300 bg-orange-500 text-white"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      {option.label}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="px-2 py-3 text-sm text-slate-500">{emptyText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
