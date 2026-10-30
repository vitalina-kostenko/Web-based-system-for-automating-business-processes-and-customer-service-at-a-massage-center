import { Field } from "@/shared/ui";
import { createServiceAction } from "../api/manage-service.actions";

// component
export function ServiceForm() {
  // return
  return (
    <form action={createServiceAction} className="card grid gap-4 sm:grid-cols-2">
      <Field label="РќР°Р·РІР°" name="name" required minLength={2} />
      <Field label="РљР°С‚РµРіРѕСЂС–СЏ" name="category" required defaultValue="РљР»Р°СЃРёС‡РЅРёР№" />
      <Field label="РўСЂРёРІР°Р»С–СЃС‚СЊ (С…РІ)" name="durationMin" type="number" min={15} step={15} required defaultValue={60} />
      <Field label="Р¦С–РЅР° (в‚ґ)" name="price" type="number" min={1} required defaultValue={800} />
      <div className="sm:col-span-2">
        <Field label="РћРїРёСЃ" name="description" />
      </div>
      <button className="btn-primary sm:w-fit">Р”РѕРґР°С‚Рё РїРѕСЃР»СѓРіСѓ</button>
    </form>
  );
}
