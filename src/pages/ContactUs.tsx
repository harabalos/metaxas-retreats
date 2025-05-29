import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix the Leaflet default icon issue
// This is the correct way to handle the icon issue in Leaflet 1.9.4
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ContactUs = () => {
  // Updated coordinates as requested - [lat, lng] format for Leaflet
  const metaxasRentsCoords: [number, number] = [38.640048782722396, 20.69898862142832];
  const position = metaxasRentsCoords;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-forest-dark mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl">
          We'd love to hear from you! Find us in the beautiful area of Poros, Mikros Gialos in Lefkada island, or reach out through phone or email.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">Visit Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Metaxas Retreats</p>
              <p className="text-gray-700">Poros, Mikros Gialos</p>
              <p className="text-gray-700">Lefkada, Ionian Islands</p>
              <p className="text-gray-700">Greece</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <Phone className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">+30 6980429891</p>
              <p className="text-gray-600 mt-2">Available daily</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-forest-light/30 p-3 rounded-full">
                <Mail className="h-6 w-6 text-forest" />
              </div>
              <CardTitle className="text-forest-dark">Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">metaxasretreats@gmail.com</p>
              <p className="text-gray-600 mt-2">We'll respond within an hour</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-10">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark p-4 border-b">Our Location</h2>
          <div className="h-[500px] relative">
            <MapContainer 
              center={position}
              zoom={11} 
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <b>Metaxas Retreats</b><br />
                  Poros, Mikros Gialos, Lefkada
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="p-4 bg-forest-light/10">
            <p className="text-forest-dark">
              <strong>Note:</strong> Mikros Gialos is one of the most beautiful bays in Lefkada, with crystal clear waters and a peaceful atmosphere. Our accommodations are just a short walk from the beach!
            </p>
          </div>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-forest-dark">How to Reach Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-forest text-lg mb-2">By Car</h3>
              <p className="text-gray-700">
                From Lefkada Town, follow the signs to Nidri and continue south.
                Our accommodations are located in the area of Mikros Gialos, just 50m from the beach.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium text-forest text-lg mb-2">By Bus</h3>
              <p className="text-gray-700">
                There are regular bus services from Lefkada Town to Sivota. From Sivota, you can take a taxi to Mikros Gialos (approximately 5km).
              </p>
            </div>
            <div>
              <h3 className="font-medium text-forest text-lg mb-2">By Boat</h3>
              <p className="text-gray-700">
                Mikros Gialos is accessible by boat from various points along the east coast of Lefkada.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-wood-light/20 rounded-lg p-6">
          <h2 className="text-2xl font-heading font-semibold text-forest-dark mb-4">Book Your Stay in Mikros Gialos</h2>
          <p className="text-gray-700 mb-4">
            Experience the beauty and tranquility of Mikros Gialos bay, with its crystal-clear turquoise waters, pebble beach, and charming tavernas. Our accommodations offer the perfect base to explore this hidden gem of Lefkada island.
          </p>
          <p className="text-forest-dark">
            Contact us now to check availability for your preferred dates!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
