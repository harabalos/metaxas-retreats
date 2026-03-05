import React, { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, RefreshCw, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  BookingRow, AccommodationRow,
  SOURCE_COLORS, SOURCE_LABELS,
  PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS,
  generateBookingRef,
} from './types';

interface Props {
  bookings: BookingRow[];
  accommodations: AccommodationRow[];
  onRefresh: () => void;
}

const emptyForm = {
  accommodation_id: '', start_date: '', end_date: '', source: 'manual',
  guest_name: '', guest_email: '', guest_phone: '', num_guests: '',
  total_price: '', payment_status: 'pending', notes: '', platform_url: '', external_id: '',
};

export default function BookingsTab({ bookings, accommodations, onRefresh }: Props) {
  const [filterAcc, setFilterAcc] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const getAccName = (id: string) => {
    const acc = accommodations.find((a) => a.id === id || a.slug === id);
    return acc?.name?.en || id;
  };

  const filtered = bookings.filter((b) => {
    if (filterAcc !== 'all' && b.accommodation_id !== filterAcc) return false;
    if (filterSource !== 'all' && b.source !== filterSource) return false;
    if (filterPayment !== 'all' && b.payment_status !== filterPayment) return false;
    return true;
  });

  const handleAdd = async () => {
    if (!form.accommodation_id || !form.start_date || !form.end_date) {
      toast.error('Property, check-in and check-out are required');
      return;
    }
    setSaving(true);
    const payload: any = {
      accommodation_id: form.accommodation_id,
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
    if (form.external_id) payload.external_id = form.external_id;
    if (['direct', 'manual'].includes(form.source)) payload.booking_reference = generateBookingRef();

    const { error } = await supabase.from('bookings').insert(payload);
    setSaving(false);
    if (error) { toast.error('Failed: ' + error.message); return; }
    toast.success('Booking added!');
    setShowAdd(false);
    setForm(emptyForm);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    setDeletingId(null);
    if (error) { toast.error('Failed: ' + error.message); return; }
    toast.success('Removed');
    onRefresh();
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ payment_status: status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Payment status updated');
    onRefresh();
  };

  const updateNotes = async (id: string, notes: string) => {
    const { error } = await supabase.from('bookings').update({ notes }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Notes saved');
    onRefresh();
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={filterAcc} onValueChange={setFilterAcc}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All properties" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All properties</SelectItem>
            {accommodations.map((a) => <SelectItem key={a.id} value={a.slug}>{a.name?.en}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All sources" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All payments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" onClick={onRefresh} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
        <div className="ml-auto">
          <Button onClick={() => setShowAdd(true)} className="bg-forest hover:bg-forest-dark">
            <Plus className="h-4 w-4 mr-1" /> Add Booking
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No bookings found.</TableCell>
              </TableRow>
            ) : filtered.map((b) => {
              const nights = differenceInDays(parseISO(b.end_date), parseISO(b.start_date));
              const isExpanded = expandedId === b.id;
              return (
                <React.Fragment key={b.id}>
                  <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(isExpanded ? null : b.id)}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{b.booking_reference || '—'}</TableCell>
                    <TableCell className="font-medium text-sm">{getAccName(b.accommodation_id)}</TableCell>
                    <TableCell><Badge className={SOURCE_COLORS[b.source] || 'bg-gray-100'} variant="outline">{SOURCE_LABELS[b.source] || b.source}</Badge></TableCell>
                    <TableCell className="text-sm">{b.guest_name || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="text-sm">{format(parseISO(b.start_date), 'dd MMM yy')}</TableCell>
                    <TableCell className="text-sm">{format(parseISO(b.end_date), 'dd MMM yy')}</TableCell>
                    <TableCell className="text-sm">{nights}</TableCell>
                    <TableCell className="text-sm">{b.total_price ? `€${b.total_price}` : '—'}</TableCell>
                    <TableCell>
                      {b.payment_status ? (
                        <Badge className={PAYMENT_STATUS_COLORS[b.payment_status] || ''}>
                          {PAYMENT_STATUS_LABELS[b.payment_status] || b.payment_status}
                        </Badge>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground inline" /> : <ChevronDown className="h-4 w-4 text-muted-foreground inline" />}
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-gray-50/80">
                      <TableCell colSpan={10} className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          {/* Editable guest fields */}
                          <div className="space-y-2">
                            <p className="font-medium text-xs uppercase text-muted-foreground mb-2">Guest Info</p>
                            <div className="space-y-1">
                              <Label className="text-xs">Name</Label>
                              <Input className="h-8 text-sm" defaultValue={b.guest_name || ''} placeholder="Guest name"
                                onBlur={(e) => { if (e.target.value !== (b.guest_name || '')) supabase.from('bookings').update({ guest_name: e.target.value || null }).eq('id', b.id).then(({ error }) => { if (error) toast.error(error.message); else onRefresh(); }); }} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Email</Label>
                              <Input className="h-8 text-sm" type="email" defaultValue={b.guest_email || ''} placeholder="email@example.com"
                                onBlur={(e) => { if (e.target.value !== (b.guest_email || '')) supabase.from('bookings').update({ guest_email: e.target.value || null }).eq('id', b.id).then(({ error }) => { if (error) toast.error(error.message); else onRefresh(); }); }} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Phone</Label>
                              <Input className="h-8 text-sm" defaultValue={b.guest_phone || ''} placeholder="+30 ..."
                                onBlur={(e) => { if (e.target.value !== (b.guest_phone || '')) supabase.from('bookings').update({ guest_phone: e.target.value || null }).eq('id', b.id).then(({ error }) => { if (error) toast.error(error.message); else onRefresh(); }); }} />
                            </div>
                          </div>
                          {/* Price + guests */}
                          <div className="space-y-2">
                            <p className="font-medium text-xs uppercase text-muted-foreground mb-2">Pricing</p>
                            <div className="space-y-1">
                              <Label className="text-xs">Guests</Label>
                              <Input className="h-8 text-sm" type="number" min={1} defaultValue={b.num_guests ?? ''}
                                onBlur={(e) => { const v = e.target.value ? parseInt(e.target.value) : null; if (v !== b.num_guests) supabase.from('bookings').update({ num_guests: v }).eq('id', b.id).then(({ error }) => { if (error) toast.error(error.message); else onRefresh(); }); }} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Total Price (€)</Label>
                              <Input className="h-8 text-sm" type="number" step="0.01" defaultValue={b.total_price ?? ''}
                                onBlur={(e) => { const v = e.target.value ? parseFloat(e.target.value) : null; if (v !== b.total_price) supabase.from('bookings').update({ total_price: v }).eq('id', b.id).then(({ error }) => { if (error) toast.error(error.message); else onRefresh(); }); }} />
                            </div>
                            {b.platform_url && (
                              <a href={b.platform_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 text-xs underline mt-2">
                                <ExternalLink className="h-3 w-3" /> Platform link
                              </a>
                            )}
                          </div>
                          {/* Payment status */}
                          <div className="space-y-2">
                            <p className="font-medium text-xs uppercase text-muted-foreground mb-2">Payment Status</p>
                            <Select value={b.payment_status || 'pending'} onValueChange={(v) => updatePaymentStatus(b.id, v)}>
                              <SelectTrigger className="w-full h-8 text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Notes */}
                          <div className="space-y-2">
                            <p className="font-medium text-xs uppercase text-muted-foreground mb-2">Notes</p>
                            <Textarea rows={4} className="text-sm" defaultValue={b.notes || ''}
                              onBlur={(e) => { if (e.target.value !== b.notes) updateNotes(b.id, e.target.value); }} />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(b.id)} disabled={deletingId === b.id}>
                            <Trash2 className="h-3 w-3 mr-1" /> {deletingId === b.id ? 'Removing...' : 'Remove'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Add Booking Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Booking</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <Label>Property *</Label>
              <Select value={form.accommodation_id} onValueChange={(v) => setForm((f) => ({ ...f, accommodation_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>{accommodations.map((a) => <SelectItem key={a.id} value={a.slug}>{a.name?.en}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Check-in *</Label><Input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Check-out *</Label><Input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Block</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="booking">Booking.com</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Guests</Label><Input type="number" min={1} value={form.num_guests} onChange={(e) => setForm((f) => ({ ...f, num_guests: e.target.value }))} /></div>
            </div>
            {form.source !== 'manual' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Guest Name</Label><Input value={form.guest_name} onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Phone</Label><Input value={form.guest_phone} onChange={(e) => setForm((f) => ({ ...f, guest_phone: e.target.value }))} /></div>
                </div>
                <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.guest_email} onChange={(e) => setForm((f) => ({ ...f, guest_email: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Total Price (€)</Label><Input type="number" step="0.01" value={form.total_price} onChange={(e) => setForm((f) => ({ ...f, total_price: e.target.value }))} /></div>
                  <div className="space-y-1">
                    <Label>Payment Status</Label>
                    <Select value={form.payment_status} onValueChange={(v) => setForm((f) => ({ ...f, payment_status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1"><Label>Platform URL</Label><Input placeholder="https://airbnb.com/..." value={form.platform_url} onChange={(e) => setForm((f) => ({ ...f, platform_url: e.target.value }))} /></div>
              </>
            )}
            <div className="space-y-1"><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving} className="bg-forest hover:bg-forest-dark">{saving ? 'Adding...' : 'Add Booking'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
