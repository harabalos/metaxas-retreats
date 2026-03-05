import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Inquiry, AccommodationRow, INQUIRY_STATUS_COLORS } from './types';

interface Props {
  inquiries: Inquiry[];
  accommodations: AccommodationRow[];
  onRefresh: () => void;
  onConvertToBooking: (inquiry: Inquiry) => void;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  replied: 'Replied',
  converted: 'Converted',
  closed: 'Closed',
};

export default function InquiriesTab({ inquiries, accommodations, onRefresh, onConvertToBooking }: Props) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAcc, setFilterAcc] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const getAccName = (id: string | null) => {
    if (!id) return '—';
    const acc = accommodations.find((a) => a.slug === id || a.id === id);
    return acc?.name?.en || id;
  };

  const filtered = inquiries.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterAcc !== 'all' && i.accommodation_id !== filterAcc) return false;
    return true;
  });

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Status updated');
    onRefresh();
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase.from('inquiries').update({ notes: notesDraft }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Notes saved');
    setEditingNotes(null);
    onRefresh();
  };

  const whatsappLink = (phone: string | null, inquiry: Inquiry) => {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '');
    const accName = getAccName(inquiry.accommodation_id);
    const msg = `Hello ${inquiry.guest_name || ''},\n\nThank you for your inquiry about ${accName}${inquiry.check_in ? ` (${inquiry.check_in} – ${inquiry.check_out})` : ''}.\n\nMetaxas Retreats`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterAcc} onValueChange={setFilterAcc}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All properties" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All properties</SelectItem>
            {accommodations.map((a) => <SelectItem key={a.id} value={a.slug}>{a.name?.en}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
        {newCount > 0 && (
          <Badge className="bg-red-100 text-red-800 ml-auto">
            <MessageSquare className="h-3 w-3 mr-1" /> {newCount} new
          </Badge>
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No inquiries found.</TableCell></TableRow>
            ) : filtered.map((inq) => {
              const isExpanded = expandedId === inq.id;
              const wa = whatsappLink(inq.phone, inq);
              return (
                <React.Fragment key={inq.id}>
                  <TableRow
                    className={`cursor-pointer hover:bg-gray-50 ${inq.status === 'new' ? 'bg-red-50/40' : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                  >
                    <TableCell>
                      <p className="font-medium text-sm">{inq.guest_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{inq.email || '—'}</p>
                    </TableCell>
                    <TableCell className="text-sm">{getAccName(inq.accommodation_id)}</TableCell>
                    <TableCell className="text-sm">{inq.check_in || '—'}</TableCell>
                    <TableCell className="text-sm">{inq.check_out || '—'}</TableCell>
                    <TableCell className="text-sm">{inq.num_guests || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(parseISO(inq.created_at), 'dd MMM HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge className={INQUIRY_STATUS_COLORS[inq.status] || 'bg-gray-100'}>
                        {STATUS_LABELS[inq.status] || inq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground inline" /> : <ChevronDown className="h-4 w-4 text-muted-foreground inline" />}
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="bg-gray-50/80">
                      <TableCell colSpan={8} className="py-4 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {/* Message */}
                          <div>
                            <p className="text-xs uppercase font-medium text-muted-foreground mb-2">Message</p>
                            <p className="bg-white rounded-lg p-3 border text-sm whitespace-pre-wrap">{inq.message || <span className="text-muted-foreground">No message</span>}</p>
                          </div>
                          {/* Actions */}
                          <div>
                            <p className="text-xs uppercase font-medium text-muted-foreground mb-2">Actions</p>
                            <div className="space-y-2">
                              {inq.email && (
                                <a href={`mailto:${inq.email}?subject=Re: Your inquiry for ${getAccName(inq.accommodation_id)}`} className="flex items-center gap-2 text-blue-600 underline text-sm">
                                  <ExternalLink className="h-3 w-3" /> Reply by Email
                                </a>
                              )}
                              {wa && (
                                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 underline text-sm">
                                  <ExternalLink className="h-3 w-3" /> Reply on WhatsApp
                                </a>
                              )}
                              <Button size="sm" variant="outline" className="text-xs" onClick={() => onConvertToBooking(inq)}>
                                Convert to Booking
                              </Button>
                            </div>
                          </div>
                          {/* Status + Notes */}
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs uppercase text-muted-foreground">Status</Label>
                              <Select value={inq.status} onValueChange={(v) => updateStatus(inq.id, v)}>
                                <SelectTrigger className="w-full h-8 text-sm mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs uppercase text-muted-foreground">Internal Notes</Label>
                              {editingNotes === inq.id ? (
                                <div className="mt-1 space-y-1">
                                  <Textarea rows={2} className="text-sm" value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} />
                                  <div className="flex gap-2">
                                    <Button size="sm" className="text-xs h-7" onClick={() => saveNotes(inq.id)}>Save</Button>
                                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setEditingNotes(null)}>Cancel</Button>
                                  </div>
                                </div>
                              ) : (
                                <p
                                  className="mt-1 text-sm bg-white border rounded p-2 cursor-pointer hover:bg-gray-50 min-h-[2rem]"
                                  onClick={() => { setEditingNotes(inq.id); setNotesDraft(inq.notes || ''); }}
                                >
                                  {inq.notes || <span className="text-muted-foreground">Click to add notes…</span>}
                                </p>
                              )}
                            </div>
                          </div>
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
    </div>
  );
}
