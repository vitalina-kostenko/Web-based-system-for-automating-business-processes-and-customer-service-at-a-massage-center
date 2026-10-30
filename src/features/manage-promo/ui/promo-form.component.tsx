import { Field } from "@/shared/ui";
import { createPromoAction } from "../api/manage-promo.actions";

// component
export function PromoForm() {
  // return
  return (
    <form action={createPromoAction} className="card grid gap-4 sm:grid-cols-2">
      <Field label="Код" name="code" required minLength={3} maxLength={20} placeholder="SPRING10" />
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Тип знижки</span>
        <select name="kind" className="input">
          <option value="percent">Відсоток (%)</option>
          <option value="fixed">Сума (₴)</option>
        </select>
      </label>
      <Field label="Значення" name="value" type="number" min={1} required defaultValue={10} />
      <Field label="Ліміт використань" name="maxUses" type="number" min={1} placeholder="Без ліміту" />
      <Field label="Діє до" name="expiresAt" type="date" />
      <div className="flex items-end">
        <button className="btn-primary">Створити промокод</button>
      </div>
    </form>
  );
}
