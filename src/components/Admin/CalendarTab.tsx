import { useState, useMemo } from 'react';
import {
  format, parseISO, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, addMonths, subMonths, addDays,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  BookingRow, AccommodationRow, SOURCE_COLORS, SOURCE_LABELS,
  SOURCE_BG, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS, generateBookingRef,
} from './types';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Props {
  bookings: BookingRow[];
  accommodations: AccommodationRow[];
  onRefresh: () => void;
}

interface NewBlockForm {
  start_date: string;
  end_date: string;
  source: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  num_guests: string;
  total_price: string;
  payment_status: string;
  notes: string;
  platform_url: string;
}

function getMonFirstDayOffset(date: Date): number {
  // getDay(): 0=Sun,1=Mon,...,6=Sat → convert to Mon-first: Mon=0,...,Sun=6
  const d = getDay(date);
  return d === 0 ? 6 : d - 1;
}

export default function CalendarTab({ bookings, accommodations, onRefresh }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [addBlockAccId, setAddBlockAccId] = useState('');
  const [addBlockDate, setAddBlockDate] = useState('');
  const [savingDelete, setSavingDelete] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);
  const [form, setForm] = useState<NewBlockForm>({
    start_date: '', end_date: '', source: 'manual',
    guest_name: '', guest_email: '', guest_phone: '',
    num_guests: '', total_price: '', payment_status: 'pending',
    notes: '', platform_url: '',
  });

  const monthLabel = format(currentMonth, 'MMMM yyyy');

  // Build a lookup: accommodation_id → day_string → booking
  const bookingMap = useMemo(() => {
    const map: Record<string, Record<string, BookingRow>> = {};
    bookings.forEach((b) => {
      if (!map[b.accommodation_id]) map[b.accommodation_id] = {};
      const start = parseISO(b.start_date);
      const end = parseISO(b.end_date);
      let d = start;
      while (d < end) {
        map[b.accommodation_id][format(d, 'yyyy-MM-dd')] = b;
        d = addDays(d, 1);
      }
    });
    return map;
  }, [bookings]);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  }, [currentMonth]);

  const handleDayClick = (accId: string, day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const booking = bookingMap[accId]?.[dayStr];
    if (booking) {
      setSelectedBooking(booking);
    } else {
      setAddBlockAccId(accId);
      setAddBlockDate(dayStr);
      setForm((f) => ({ ...f, start_date: dayStr, end_date: '' }));
      setShowAddBlock(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;
    setSavingDelete(true);
    const { error } = await supabase.from('bookings').delete().eq('id', selectedBooking.id);
    setSavingDelete(false);
    if (error) { toast.error('Failed to delete: ' + error.message); return; }
    toast.success('Booking removed');
    setSelectedBooking(null);
    onRefresh();
  };

  const handleAdd = async () => {
    if (!form.start_date || !form.end_date || !addBlockAccId) {
      toast.error('Accommodation, check-in and check-out are required');
      return;
    }
    setSavingAdd(true);
    const payload: any = {
      accommodation_id: addBlockAccId,
      start_date: form.start_date,
      end_date: form.end_date,
      source: form.source,
      payment_status: form.payment_status,
    };
    if (form.guest_name) payload.guest_name = form.guest_name;
    if (form.guest_email) payload.guest_email = form.guest_email;
    if (form.guest_phone) payload.guest_phone = form.guest_phone;
    if (form.num_guests) payload.num_guests = parseInt(form.num_guests);
    if (form.total_price) payload.total_price = parseFloat(form.total_price);
    if (form.notes) payload.notes = form.notes;
    if (form.platform_url) payload.platform_url = form.platform_url;
    if (['direct', 'manual'].includes(form.source)) {
      payload.booking_reference = generateBookingRef();
    }

    const { error } = await supabase.from('bookings').insert(payload);
    setSavingAdd(false);
    if (error) { toast.error('Failed to add: ' + error.message); return; }
    toast.success('Added successfully');
    setShowAddBlock(false);
    setForm({ start_date: '', end_date: '', source: 'manual', guest_name: '', guest_email: '', guest_phone: '', num_guests: '', total_price: '', payment_status: 'pending', notes: '', platform_url: '' });
    onRefresh();
  };

  const getAccName = (id: string) => {
    const acc = accommodations.find((a) => a.id === id || a.slug === id);
    return acc?.name?.en || id;
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {Object.entries(SOURCE_LABELS).filter(([k]) => k !== 'external').map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${SOURCE_BG[key]}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* One tab per accommodation */}
      <Tabs defaultValue={accommodations[0]?.slug || ''}>
        <TabsList className="mb-4 flex-wrap h-auto">
          {accommodations.map((acc) => (
            <TabsTrigger key={acc.id} value={acc.slug} className="text-xs">
              {acc.name?.en}
            </TabsTrigger>
          ))}
        </TabsList>

        {accommodations.map((acc) => {
          const accMap = bookingMap[acc.slug] || {};
          const offset = getMonFirstDayOffset(daysInMonth[0]);
          const cells: (Date | null)[] = [...Array(offset).fill(null), ...daysInMonth];
          // Pad to full weeks
          while (cells.length % 7 !== 0) cells.push(null);
          const todayStr = format(new Date(), 'yyyy-MM-dd');

          return (
            <TabsContent key={acc.id} value={acc.slug}>
              <div className="rounded-lg border overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 bg-gray-50 border-b">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                  {cells.map((day, i) => {
                    if (!day) {
                      return <div key={`empty-${i}`} className="h-12 border-r border-b bg-gray-50/50" />;
                    }
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const booking = accMap[dayStr];
                    const isToday = dayStr === todayStr;
                    const isStart = booking?.start_date === dayStr;
                    const isLastNight = booking ? format(addDays(parseISO(booking.end_date), -1), 'yyyy-MM-dd') === dayStr : false;

                    const bgClass = booking ? (SOURCE_BG[booking.source] || 'bg-purple-200') : '';
                    const roundClass = booking
                      ? `${isStart ? 'rounded-l-full' : ''} ${isLastNight ? 'rounded-r-full' : ''}`
                      : '';

                    return (
                      <div
                        key={dayStr}
                        onClick={() => handleDayClick(acc.slug, day)}
                        className={`h-12 border-r border-b relative flex items-center justify-center cursor-pointer hover:brightness-95 transition-all select-none ${booking ? bgClass : 'hover:bg-gray-50'}`}
                      >
                        {booking && (
                          <div className={`absolute inset-y-1 inset-x-0 ${bgClass} ${roundClass} opacity-80`} />
                        )}
                        <span className={`relative z-10 text-xs font-medium ${isToday ? 'bg-forest text-white w-6 h-6 rounded-full flex items-center justify-center' : ''} ${booking ? 'text-gray-700' : 'text-gray-600'}`}>
                          {format(day, 'd')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Booking detail dialog */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge className={SOURCE_COLORS[selectedBooking.source] || 'bg-gray-100'} variant="outline">
                  {SOURCE_LABELS[selectedBooking.source] || selectedBooking.source}
                </Badge>
                {selectedBooking.booking_reference && (
                  <span className="text-xs text-muted-foreground font-mono">{selectedBooking.booking_reference}</span>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Property</p><p className="font-medium">{getAccName(selectedBooking.accommodation_id)}</p></div>
                <div><p className="text-xs text-muted-foreground">Guests</p><p className="font-medium">{selectedBooking.num_guests || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Check-in</p><p className="font-medium">{format(parseISO(selectedBooking.start_date), 'dd MMM yyyy')}</p></div>
                <div><p className="text-xs text-muted-foreground">Check-out</p><p className="font-medium">{format(parseISO(selectedBooking.end_date), 'dd MMM yyyy')}</p></div>
              </div>
              {(selectedBooking.guest_name || selectedBooking.guest_email || selectedBooking.guest_phone) && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  {selectedBooking.guest_name && <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selectedBooking.guest_name}</span></p>}
                  {selectedBooking.guest_email && <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selectedBooking.guest_email}`} className="text-blue-600 underline">{selectedBooking.guest_email}</a></p>}
                  {selectedBooking.guest_phone && <p><span className="text-muted-foreground">Phone:</span> <a href={`tel:${selectedBooking.guest_phone}`} className="text-blue-600">{selectedBooking.guest_phone}</a></p>}
                </div>
              )}
              {selectedBooking.total_price && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Price</span>
                  <span className="font-bold text-lg">€{selectedBooking.total_price}</span>
                </div>
              )}
              {selectedBooking.payment_status && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <Badge className={PAYMENT_STATUS_COLORS[selectedBooking.payment_status] || ''}>
                    {PAYMENT_STATUS_LABELS[selectedBooking.payment_status] || selectedBooking.payment_status}
                  </Badge>
                </div>
              )}
              {selectedBooking.notes && (
                <div><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="bg-gray-50 rounded p-2">{selectedBooking.notes}</p></div>
              )}
              {selectedBooking.platform_url && (
                <a href={selectedBooking.platform_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 text-xs underline">
                  <ExternalLink className="h-3 w-3" /> View on platform
                </a>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedBooking(null)}>Close</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={savingDelete}>
                {savingDelete ? 'Removing...' : 'Remove'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add block/booking dialog */}
      <Dialog open={showAddBlock} onOpenChange={setShowAddBlock}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Booking / Block Dates</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <Label>Property *</Label>
              <Select value={addBlockAccId} onValueChange={setAddBlockAccId}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  {accommodations.map((acc) => (
                    <SelectItem key={acc.id} value={acc.slug}>{acc.name?.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Check-in *</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Check-out *</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Block</SelectItem>
                    <SelectItem value="direct">Direct Booking</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="booking">Booking.com</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Guests</Label>
                <Input type="number" min={1} placeholder="e.g. 2" value={form.num_guests} onChange={(e) => setForm((f) => ({ ...f, num_guests: e.target.value }))} />
              </div>
            </div>
            {form.source !== 'manual' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Guest Name</Label>
                    <Input value={form.guest_name} onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input value={form.guest_phone} onChange={(e) => setForm((f) => ({ ...f, guest_phone: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" value={form.guest_email} onChange={(e) => setForm((f) => ({ ...f, guest_email: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Total Price (€)</Label>
                    <Input type="number" step="0.01" value={form.total_price} onChange={(e) => setForm((f) => ({ ...f, total_price: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label>Payment Status</Label>
                    <Select value={form.payment_status} onValueChange={(v) => setForm((f) => ({ ...f, payment_status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
                        <SelectItem value="fully_paid">Fully Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Platform URL (optional)</Label>
                  <Input placeholder="https://airbnb.com/..." value={form.platform_url} onChange={(e) => setForm((f) => ({ ...f, platform_url: e.target.value }))} />
                </div>
              </>
            )}
            <div className="space-y-1">
              <Label>Notes (optional)</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBlock(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={savingAdd} className="bg-forest hover:bg-forest-dark">
              {savingAdd ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
