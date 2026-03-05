import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CalendarSource, SyncLog, AccommodationRow } from './types';

interface Props {
  calendarSources: CalendarSource[];
  syncLogs: SyncLog[];
  accommodations: AccommodationRow[];
  onRefresh: () => void;
}

const PLATFORMS = ['airbnb', 'booking', 'vrbo', 'other'];
const PLATFORM_LABELS: Record<string, string> = { airbnb: 'Airbnb', booking: 'Booking.com', vrbo: 'Vrbo', other: 'Other' };

export default function SyncTab({ calendarSources, syncLogs, accommodations, onRefresh }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editSource, setEditSource] = useState<CalendarSource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ accommodation_id: '', platform: 'airbnb', ical_url: '', enabled: true });

  const getAccName = (id: string) => {
    const acc = accommodations.find((a) => a.slug === id || a.id === id);
    return acc?.name?.en || id;
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-calendars', { body: {} });
      if (error) throw error;
      toast.success(`Sync complete. ${data?.logs?.length || 0} sources processed.`);
      onRefresh();
    } catch (err: any) {
      toast.error('Sync failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncOne = async (source: CalendarSource) => {
    setSyncingId(source.id);
    try {
      const { data, error } = await supabase.functions.invoke('sync-calendars', {
        body: { accommodation_id: source.accommodation_id },
      });
      if (error) throw error;
      toast.success('Sync complete for ' + getAccName(source.accommodation_id));
      onRefresh();
    } catch (err: any) {
      toast.error('Sync failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSyncingId(null);
    }
  };

  const handleSave = async () => {
    if (!form.accommodation_id || !form.ical_url) {
      toast.error('Property and iCal URL are required');
      return;
    }
    const payload = {
      accommodation_id: form.accommodation_id,
      platform: form.platform,
      ical_url: form.ical_url.trim(),
      enabled: form.enabled,
    };
    if (editSource) {
      const { error } = await supabase.from('calendar_sources').update(payload).eq('id', editSource.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Source updated');
    } else {
      const { error } = await supabase.from('calendar_sources').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Source added');
    }
    setShowAdd(false);
    setEditSource(null);
    setForm({ accommodation_id: '', platform: 'airbnb', ical_url: '', enabled: true });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('calendar_sources').delete().eq('id', id);
    setDeletingId(null);
    if (error) { toast.error(error.message); return; }
    toast.success('Source removed');
    onRefresh();
  };

  const handleToggle = async (source: CalendarSource) => {
    const { error } = await supabase.from('calendar_sources').update({ enabled: !source.enabled }).eq('id', source.id);
    if (error) { toast.error(error.message); return; }
    onRefresh();
  };

  const openEdit = (source: CalendarSource) => {
    setEditSource(source);
    setForm({ accommodation_id: source.accommodation_id, platform: source.platform, ical_url: source.ical_url, enabled: source.enabled });
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      {/* Sync controls */}
      <Card>
        <CardContent className="pt-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-medium">Sync All Calendars</p>
            <p className="text-sm text-muted-foreground">Fetch latest availability from all enabled iCal sources. Auto-runs every hour.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSyncAll} disabled={syncing} className="bg-forest hover:bg-forest-dark">
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All Now'}
            </Button>
            <Button variant="outline" onClick={() => { setEditSource(null); setForm({ accommodation_id: '', platform: 'airbnb', ical_url: '', enabled: true }); setShowAdd(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Source
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar sources table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">iCal Sources ({calendarSources.length})</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>iCal URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Synced</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calendarSources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No iCal sources configured. Add your first source to start syncing.
                </TableCell>
              </TableRow>
            ) : calendarSources.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-sm">{getAccName(s.accommodation_id)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{PLATFORM_LABELS[s.platform] || s.platform}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <span className="text-xs text-muted-foreground truncate block" title={s.ical_url}>
                    {s.ical_url.replace(/^https?:\/\//, '').substring(0, 40)}…
                  </span>
                </TableCell>
                <TableCell>
                  {!s.last_sync_status ? (
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Never</span>
                  ) : s.last_sync_status === 'success' ? (
                    <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> OK</span>
                  ) : (
                    <span className="text-xs text-red-500 flex items-center gap-1" title={s.last_sync_error || ''}>
                      <XCircle className="h-3 w-3" /> Error
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {s.last_synced_at ? format(parseISO(s.last_synced_at), 'dd MMM HH:mm') : '—'}
                </TableCell>
                <TableCell className="text-sm">{s.last_sync_count ?? '—'}</TableCell>
                <TableCell>
                  <Switch checked={s.enabled} onCheckedChange={() => handleToggle(s)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleSyncOne(s)} disabled={syncingId === s.id || !s.enabled} title="Sync now">
                      <RefreshCw className={`h-3 w-3 ${syncingId === s.id ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Sync logs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sync Log (last 20 runs)</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syncLogs.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No sync history yet.</TableCell></TableRow>
            ) : syncLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs">{format(parseISO(log.synced_at), 'dd MMM HH:mm')}</TableCell>
                <TableCell className="text-sm">{log.accommodation_id ? getAccName(log.accommodation_id) : '—'}</TableCell>
                <TableCell className="text-sm">{log.platform ? (PLATFORM_LABELS[log.platform] || log.platform) : '—'}</TableCell>
                <TableCell className="text-sm">{log.events_synced}</TableCell>
                <TableCell>
                  {log.status === 'success' ? (
                    <span className="text-green-600 text-xs flex items-center gap-1"><CheckCircle className="h-3 w-3" /> OK</span>
                  ) : (
                    <span className="text-red-500 text-xs flex items-center gap-1" title={log.error_message || ''}>
                      <XCircle className="h-3 w-3" /> Error
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit dialog */}
      <Dialog open={showAdd} onOpenChange={(open) => { setShowAdd(open); if (!open) setEditSource(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editSource ? 'Edit iCal Source' : 'Add iCal Source'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Property *</Label>
              <Select value={form.accommodation_id} onValueChange={(v) => setForm((f) => ({ ...f, accommodation_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>{accommodations.map((a) => <SelectItem key={a.id} value={a.slug}>{a.name?.en}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Platform *</Label>
              <Select value={form.platform} onValueChange={(v) => setForm((f) => ({ ...f, platform: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{PLATFORM_LABELS[p] || p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>iCal URL *</Label>
              <Input
                placeholder="https://www.airbnb.com/calendar/ical/..."
                value={form.ical_url}
                onChange={(e) => setForm((f) => ({ ...f, ical_url: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Paste the iCal export link from Airbnb / Booking.com settings</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.enabled} onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))} id="enabled" />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditSource(null); }}>Cancel</Button>
            <Button onClick={handleSave} className="bg-forest hover:bg-forest-dark">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
