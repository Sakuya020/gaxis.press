import CustomPortableText from "@/components/events/CustomPortableText";
import getEvents from "@/lib/getEvents";
import { formatDate } from "@/lib/utils";
import { EventType } from "@/lib/types";

const page = async () => {
  const events = await getEvents();
  return events.map((event: EventType) => (
    <div
      key={event.date}
      className="grid grid-cols-6 gap-[10px] px-[30px] border-b border-b-secondary fade-in-down"
    >
      <div className="col-span-1 py-[10px]">
        {formatDate(event.date).slice(2)}
      </div>
      <div className="col-span-5 py-[10px]">
        <CustomPortableText value={event.description} />
      </div>
    </div>
  ));
};

export default page;
