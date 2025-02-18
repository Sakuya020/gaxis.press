"use client";

import { useState, useEffect } from "react";
import { EventType } from "@/lib/types";
import CustomPortableText from "./CustomPortableText";
import { formatDate } from "@/lib/utils";
import getEvents from "@/lib/getEvents";

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents();
      setEvents(events);
    };

    fetchEvents();
  }, []);

  return (
    <>
      {events.map((event) => (
        <div
          key={event.date}
          className="grid grid-cols-5 gap-[10px] px-[30px] border-b border-b-secondary"
        >
          <div className="col-span-1 py-[20px]">{formatDate(event.date)}</div>
          <div className="col-span-4 py-[20px] whitespace-nowrap">
            <CustomPortableText value={event.description} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Events;
