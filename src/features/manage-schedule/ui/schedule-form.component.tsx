import { saveScheduleAction } from "../api/manage-schedule.actions";

// interface
type ScheduleFormProps = {
  masterId: string;
  schedule: { weekday: number; startMin: number; endMin: number }[];
};

const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const order = [1, 2, 3, 4, 5, 6, 0];

function toTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

// component
export function ScheduleForm({ masterId, schedule }: ScheduleFormProps) {
  // return
  return (
    <form action={saveScheduleAction.bind(null, masterId)} className="space-y-3">
      <div className="space-y-2">
        {order.map((weekday) => {
          const row = schedule.find((s) => s.weekday === weekday);
          return (
            <div key={weekday} className="flex items-center gap-2 text-sm">
              <label className="flex w-14 items-center gap-2">
                <input type="checkbox" name={`day${weekday}`} defaultChecked={Boolean(row)} className="accent-brand" />
                {days[weekday]}
              </label>
              <input type="time" name={`start${weekday}`} defaultValue={toTime(row?.startMin ?? 540)} className="input w-28" />
              <span className="text-muted">до</span>
              <input type="time" name={`end${weekday}`} defaultValue={toTime(row?.endMin ?? 1080)} className="input w-28" />
            </div>
          );
        })}
      </div>
      <button className="btn-primary">Зберегти графік</button>
    </form>
  );
}
