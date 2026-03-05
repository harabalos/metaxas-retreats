import { useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CalendarX, Users, TrendingUp, RefreshCw, MessageSquare } from 'lucide-react';
import { BookingRow, AccommodationRow, CalendarSource, Inquiry, SOURCE_COLORS, SOURCE_LABELS } from './types';

interface Props {
  bookings: BookingRow[];
  accommodations: AccommodationRow[];
  calendarSources: CalendarSource[];
  inquiries: Inquiry[];
}

function getOccupancy(bookings: BookingRow[], accId: string, month: Date): number {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const bookedDays = new Set<string>();
  bookings
    .filter((b) => b.accommodation_id === accId)
    .forEach((b) => {
      const start = parseISO(b.start_date);
      const end = parseISO(b.end_date);
      days.forEach((day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        if (day >= start && day < end) bookedDays.add(dayStr);
      });
    });
  return Math.round((bookedDays.size / days.length) * 100);
}

export default function OverviewTab({ bookings, accommodations, calendarSources, inquiries }: Props) {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const in7Days = format(new Date(today.getTime() + 7 * 86400000), 'yyyy-MM-dd');

  const upcomingCheckIns = useMemo(
    () => bookings.filter((b) => b.start_date >= todayStr && b.start_date <= in7Days).sort((a, b) => a.start_date.localeCompare(b.start_date)),
    [bookings, todayStr, in7Days]
  );

  const upcomingCheckOuts = useMemo(
    () => bookings.filter((b) => b.end_date >= todayStr && b.end_date <= in7Days).sort((a, b) => a.end_date.localeCompare(b.end_date)),
    [bookings, todayStr, in7Days]
  );

  const pendingInquiries = inquiries.filter((i) => i.status === 'new').length;

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.source] = (counts[b.source] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  const getAccName = (id: string) => {
    const acc = accommodations.find((a) => a.id === id || a.slug === id);
    return acc ? (acc.name?.en || acc.slug) : id;
  };

  const getSyncStatus = (accId: string) => {
    const sources = calendarSources.filter((s) => s.accommodation_id === accId);
    if (sources.length === 0) return null;
    const hasError = sources.some((s) => s.last_sync_status === 'error');
    const lastSync = sources
      .filter((s) => s.last_synced_at)
      .sort((a, b) => (b.last_synced_at || '').localeCompare(a.last_synced_at || ''))[0];
    return { hasError, lastSync };
  };

  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><CalendarCheck className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Check-ins (7d)</p>
                <p className="text-2xl font-bold">{upcomingCheckIns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg"><CalendarX className="h-5 w-5 text-orange-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Check-outs (7d)</p>
                <p className="text-2xl font-bold">{upcomingCheckOuts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-forest/10 rounded-lg"><Users className="h-5 w-5 text-forest" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${pendingInquiries > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                <MessageSquare className={`h-5 w-5 ${pendingInquiries > 0 ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New Inquiries</p>
                <p className="text-2xl font-bold">{pendingInquiries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming check-ins */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-green-600" /> Upcoming Check-ins (next 7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingCheckIns.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No check-ins in the next 7 days</p>
            ) : (
              <div className="space-y-2">
                {upcomingCheckIns.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium">{b.guest_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{getAccName(b.accommodation_id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{format(parseISO(b.start_date), 'dd MMM')}</p>
                      <Badge className={SOURCE_COLORS[b.source] || 'bg-gray-100'} variant="outline">
                        {SOURCE_LABELS[b.source] || b.source}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming check-outs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarX className="h-4 w-4 text-orange-500" /> Upcoming Check-outs (next 7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingCheckOuts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No check-outs in the next 7 days</p>
            ) : (
              <div className="space-y-2">
                {upcomingCheckOuts.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium">{b.guest_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{getAccName(b.accommodation_id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{format(parseISO(b.end_date), 'dd MMM')}</p>
                      <Badge className={SOURCE_COLORS[b.source] || 'bg-gray-100'} variant="outline">
                        {SOURCE_LABELS[b.source] || b.source}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy this month */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-forest" /> Occupancy — {format(today, 'MMMM yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accommodations.map((acc) => {
              const pct = getOccupancy(bookings, acc.slug, today);
              return (
                <div key={acc.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{acc.name?.en}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-forest transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Bookings by source + Sync status */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bookings by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(sourceCounts).map(([source, count]) => (
                  <div key={source} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                    <Badge className={SOURCE_COLORS[source] || 'bg-gray-100'} variant="outline">
                      {SOURCE_LABELS[source] || source}
                    </Badge>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                ))}
                {Object.keys(sourceCounts).length === 0 && (
                  <p className="text-sm text-muted-foreground">No bookings yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {accommodations.map((acc) => {
                const status = getSyncStatus(acc.slug);
                return (
                  <div key={acc.id} className="flex items-center justify-between text-sm">
                    <span>{acc.name?.en}</span>
                    {status ? (
                      <div className="flex items-center gap-2">
                        <span className={status.hasError ? 'text-red-500' : 'text-green-600'}>
                          {status.hasError ? '❌ Error' : '✅ OK'}
                        </span>
                        {status.lastSync?.last_synced_at && (
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(status.lastSync.last_synced_at), 'dd MMM HH:mm')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">No sources</span>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
