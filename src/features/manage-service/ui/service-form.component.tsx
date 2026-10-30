import { Field } from "@/shared/ui";
import { createServiceAction } from "../api/manage-service.actions";

// component
export function ServiceForm() {
  // return
  return (
    <form action={createServiceAction} className="card grid gap-4 sm:grid-cols-2">
      <Field label="Назва" name="name" required minLength={2} />
      <Field label="Категорія" name="category" required defaultValue="Класичний" />
      <Field label="Тривалість (хв)" name="durationMin" type="number" min={15} step={15} required defaultValue={60} />
      <Field label="Ціна (₴)" name="price" type="number" min={1} required defaultValue={800} />
      <div className="sm:col-span-2">
        <Field label="Опис" name="description" />
      </div>
      <button className="btn-primary sm:w-fit">Додати послугу</button>
    </form>
  );
}
