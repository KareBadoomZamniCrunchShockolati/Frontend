import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";

export function SearchTopBar({
  onBack,
  onFilter,
}: {
  onBack: () => void;
  onFilter: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between bg-card px-4 pt-4 pb-2 shadow-sm border-b border-border"
      dir="rtl"
    >
      <button
        type="button"
        onClick={onFilter}
        className="grid h-10 w-10 place-items-center rounded-xl border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        aria-label="فیلتر"
      >
        <SlidersHorizontal className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={onBack}
        className="grid h-10 w-10 place-items-center rounded-xl border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        aria-label="بازگشت"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-muted/80 transition-colors">
      <span className="whitespace-nowrap">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="grid h-5 w-5 place-items-center rounded-full hover:bg-foreground/20 transition-colors"
          aria-label="حذف فیلتر"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  hasFilters,
  searchQuery,
  onClearSearch,
}: {
  hasFilters: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center py-12">
      <Search className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
      <h3 className="text-xl font-bold text-foreground mb-3">
        {hasFilters ? "چیزی با این فیلتر پیدا نشد" : "شروع جستجو"}
      </h3>
      <p className="text-muted-foreground mb-6 text-center px-4">
        {hasFilters
          ? "فیلترها را تغییر دهید یا پاک کنید."
          : searchQuery
            ? `هیچ چالشی با عبارت "${searchQuery}" پیدا نشد`
            : "نام چالش مورد نظر خود را جستجو کنید"}
      </p>
      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          مشاهده همه چالش‌ها
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="mt-6 py-4 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-2 text-sm text-muted-foreground">در حال جستجو...</p>
    </div>
  );
}