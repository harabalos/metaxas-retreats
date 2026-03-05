import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, LayoutDashboard, Calendar, BookOpen, RefreshCw, MessageSquare, Home, Settings } from 'lucide-react';
import { toast } from 'sonner';

import OverviewTab from '@/components/Admin/OverviewTab';
import CalendarTab from '@/components/Admin/CalendarTab';
import BookingsTab from '@/components/Admin/BookingsTab';
import SyncTab from '@/components/Admin/SyncTab';
import InquiriesTab from '@/components/Admin/InquiriesTab';
import AccommodationsTab from '@/components/Admin/AccommodationsTab';
import SettingsTab from '@/components/Admin/SettingsTab';

import {
  AccommodationRow, BookingRow, CalendarSource, SyncLog, Inquiry, Setting, PriceRow,
} from '@/components/Admin/types';

const ChannelManager = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [accommodations, setAccommodations] = useState<AccommodationRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [calendarSources, setCalendarSources] = useState<CalendarSource[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  const fetchAll = useCallback(async () => {
    try {
      const [accsRes, bookingsRes, sourcesRes, logsRes, inqRes, settingsRes] = await Promise.all([
        supabase.from('accommodations').select('*, accommodation_prices(*)').order('created_at', { ascending: true }),
        supabase.from('bookings').select('*').order('start_date', { ascending: true }),
        supabase.from('calendar_sources').select('*').order('accommodation_id'),
        supabase.from('sync_logs').select('*').order('synced_at', { ascending: false }).limit(20),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*').order('key'),
      ]);

      if (accsRes.data) {
        setAccommodations(
          accsRes.data.map((a: any) => ({
            ...a,
            accommodation_prices: (a.accommodation_prices as PriceRow[]) || [],
            amenities: Array.isArray(a.amenities) ? a.amenities : [],
            images: Array.isArray(a.images) ? a.images : [],
          }))
        );
      }
      if (bookingsRes.data) setBookings(bookingsRes.data as BookingRow[]);
      if (sourcesRes.data) setCalendarSources(sourcesRes.data as CalendarSource[]);
      if (logsRes.data) setSyncLogs(logsRes.data as SyncLog[]);
      if (inqRes.data) setInquiries(inqRes.data as Inquiry[]);
      if (settingsRes.data) setSettings(settingsRes.data as Setting[]);

      if (accsRes.error) toast.error('Error loading accommodations: ' + accsRes.error.message);
      if (bookingsRes.error) toast.error('Error loading bookings: ' + bookingsRes.error.message);
    } catch (err: any) {
      toast.error('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/mx-portal/login');
  };

  // Called from InquiriesTab when user clicks "Convert to Booking"
  const handleConvertInquiry = (inquiry: Inquiry) => {
    setActiveTab('bookings');
    toast.info('Switched to Bookings tab. Click "Add Booking" and fill in the guest details.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-heading font-bold text-forest-dark">Metaxas Retreats</span>
            <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full font-medium">Owner Portal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
            <LogOut className="h-4 w-4 mr-1.5" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-1">
            <TabsList className="mb-6 inline-flex min-w-max">
              <TabsTrigger value="overview" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <LayoutDashboard className="h-3.5 w-3.5" /> Overview
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Calendar className="h-3.5 w-3.5" /> Calendar
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <BookOpen className="h-3.5 w-3.5" /> Bookings
                {bookings.length > 0 && (
                  <Badge className="ml-1 bg-forest text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5 py-0">{bookings.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sync" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <RefreshCw className="h-3.5 w-3.5" /> Sync
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <MessageSquare className="h-3.5 w-3.5" /> Inquiries
                {newInquiriesCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5 py-0">{newInquiriesCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="accommodations" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Home className="h-3.5 w-3.5" /> Properties
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Settings className="h-3.5 w-3.5" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <OverviewTab
              bookings={bookings}
              accommodations={accommodations}
              calendarSources={calendarSources}
              inquiries={inquiries}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarTab
              bookings={bookings}
              accommodations={accommodations}
              onRefresh={fetchAll}
            />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsTab
              bookings={bookings}
              accommodations={accommodations}
              onRefresh={fetchAll}
            />
          </TabsContent>

          <TabsContent value="sync">
            <SyncTab
              calendarSources={calendarSources}
              syncLogs={syncLogs}
              accommodations={accommodations}
              onRefresh={fetchAll}
            />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiriesTab
              inquiries={inquiries}
              accommodations={accommodations}
              onRefresh={fetchAll}
              onConvertToBooking={handleConvertInquiry}
            />
          </TabsContent>

          <TabsContent value="accommodations">
            <AccommodationsTab
              accommodations={accommodations}
              onRefresh={fetchAll}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              settings={settings}
              onRefresh={fetchAll}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ChannelManager;
