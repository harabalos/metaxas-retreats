// The pin: the property, as placed on Google Maps.
const LAT = 38.64003296086357;
const LNG = 20.699029254119495;

interface MapEmbedProps {
  /** Roughly how many metres the map spans: 3000 shows the bay, 30000 the south of the island. */
  span: number;
  title: string;
}

/** Google Maps with a pin on Metaxas Retreats. Fills its container; loads when scrolled near. */
const MapEmbed = ({ span, title }: MapEmbedProps) => (
  <iframe
    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${span}!2d${LNG}!3d${LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDM4JzI0LjEiTiAyMMKwNDEnNTYuNSJF!5e0!3m2!1sen!2sgr!4v1700000000000!5m2!1sen!2sgr`}
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title={title}
  />
);

export default MapEmbed;
