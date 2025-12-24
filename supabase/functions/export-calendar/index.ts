import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const accommodationId = url.searchParams.get("id");

  if (!accommodationId) {
    return new Response("Missing accommodation id", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // 1. Get bookings from DB
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("accommodation_id", accommodationId);

  // 2. Format as iCalendar (.ics)
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Metaxas Retreats//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  bookings?.forEach((booking) => {
    // Format dates as YYYYMMDD
    const start = new Date(booking.start_date).toISOString().replace(/[-:]/g, "").split("T")[0];
    const end = new Date(booking.end_date).toISOString().replace(/[-:]/g, "").split("T")[0];

    icsContent.push(
      "BEGIN:VEVENT",
      `UID:${booking.id}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      "SUMMARY:Booked",
      "END:VEVENT"
    );
  });

  icsContent.push("END:VCALENDAR");

  return new Response(icsContent.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${accommodationId}.ics"`,
    },
  });
});