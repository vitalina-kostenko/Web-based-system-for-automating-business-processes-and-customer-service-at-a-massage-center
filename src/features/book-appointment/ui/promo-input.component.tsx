// interface
type PromoInputProps = {
  code: string;
  onCode: (value: string) => void;
  onApply: () => void;
  applied: boolean;
  error: string;
  disabled: boolean;
};

// component
export function PromoInput({ code, onCode, onApply, applied, error, disabled }: PromoInputProps) {
  // return
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => onCode(e.target.value.toUpperCase())}
          placeholder="Промокод"
          className="input font-mono"
        />
        <button type="button" className="btn-outline" disabled={disabled || !code} onClick={onApply}>
          Застосувати
        </button>
      </div>
      {applied && <p className="text-sm text-brand">Промокод застосовано</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
