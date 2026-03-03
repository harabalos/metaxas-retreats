import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LogOut, Save, Plus, Trash2, CalendarOff, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PriceRow {
  id?: string;
  season: string;
  price: number;
  months: string;
}

type I18nField = Record<string, string>;

interface AccommodationRow {
  id: string;
  slug: string;
  name: I18nField;
  type: string;
  description: I18nField;
  short_description: I18nField;
  base_price: number;
  guests: number;
  accommodation_prices: PriceRow[];
}

interface BookingRow {
  id: string;
  accommodation_id: string;
  source: string;
  start_date: string;
  end_date: string;
  external_id: string | null;
  created_at: string | null;
}

const SOURCE_LABELS: Record<string, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  manual: 'Manual Block',
};

const SOURCE_COLORS: Record<string, string> = {
  airbnb: 'bg-pink-100 text-pink-800',
  booking: 'bg-blue-100 text-blue-800',
  direct: 'bg-green-100 text-green-800',
  manual: 'bg-gray-100 text-gray-700',
};

const AdminDashboard = () => {
  const [accommodations, setAccommodations] = useState<AccommodationRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState({
    accommodation_id: '',
    start_date: '',
    end_date: '',
    source: 'manual',
    external_id: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccommodations();
    fetchBookings();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*, accommodation_prices(*)')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAccommodations(
        (data || []).map((acc) => ({
          ...(acc as AccommodationRow),
          accommodation_prices: (acc.accommodation_prices as PriceRow[]) || [],
        }))
      );
    } catch (err) {
      toast.error('Failed to load accommodations: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      toast.error('Failed to load bookings: ' + (err as Error).message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const newAccs = [...accommodations];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newAccs[index] = {
        ...newAccs[index],
        [parent]: {
          ...newAccs[index][parent],
          [child]: value,
        },
      };
    } else {
      newAccs[index] = { ...newAccs[index], [field]: value };
    }
    setAccommodations(newAccs);
  };

  const handlePriceChange = (accIndex: number, priceIndex: number, field: keyof PriceRow, value: any) => {
    const newAccs = [...accommodations];
    const prices = [...newAccs[accIndex].accommodation_prices];
    prices[priceIndex] = { ...prices[priceIndex], [field]: field === 'price' ? Number(value) : value };
    newAccs[accIndex] = { ...newAccs[accIndex], accommodation_prices: prices };
    setAccommodations(newAccs);
  };

  const handleAddPriceRange = (accIndex: number) => {
    const newAccs = [...accommodations];
    newAccs[accIndex].accommodation_prices = [
      ...newAccs[accIndex].accommodation_prices,
      { season: '', price: 0, months: '' },
    ];
    setAccommodations(newAccs);
  };

  const handleRemovePriceRange = (accIndex: number, priceIndex: number) => {
    const newAccs = [...accommodations];
    newAccs[accIndex].accommodation_prices = newAccs[accIndex].accommodation_prices.filter(
      (_, i) => i !== priceIndex
    );
    setAccommodations(newAccs);
  };

  const handleUpdate = async (accIndex: number) => {
    const acc = accommodations[accIndex];
    setSavingId(acc.id);
    try {
      // Update main accommodation fields
      const { error: accError } = await supabase
        .from('accommodations')
        .update({
          base_price: acc.base_price,
          description: acc.description,
          name: acc.name,
          short_description: acc.short_description,
        })
        .eq('id', acc.id);

      if (accError) throw accError;

      // Sync seasonal prices: delete existing then re-insert
      const { error: deleteError } = await supabase
        .from('accommodation_prices')
        .delete()
        .eq('accommodation_id', acc.id);

      if (deleteError) throw deleteError;

      if (acc.accommodation_prices.length > 0) {
        const pricesToInsert = acc.accommodation_prices
          .filter((p) => p.season && p.months)
          .map((p) => ({
            accommodation_id: acc.id,
            season: p.season,
            price: p.price,
            months: p.months,
          }));

        if (pricesToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('accommodation_prices')
            .insert(pricesToInsert);
          if (insertError) throw insertError;
        }
      }

      toast.success(`${acc.name.en} saved successfully!`);
      // Invalidate the frontend cache so live pages reflect the change immediately
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    } catch (err) {
      toast.error('Failed to update: ' + (err as Error).message);
    } finally {
      setSavingId(null);
    }
  };

  const handleAddBooking = async () => {
    if (!newBooking.accommodation_id || !newBooking.start_date || !newBooking.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const payload: any = {
        accommodation_id: newBooking.accommodation_id,
        start_date: newBooking.start_date,
        end_date: newBooking.end_date,
        source: newBooking.source,
      };
      if (newBooking.external_id) payload.external_id = newBooking.external_id;

      const { error } = await supabase.from('bookings').insert(payload);
      if (error) throw error;

      toast.success('Booking / block added!');
      setShowAddBooking(false);
      setNewBooking({ accommodation_id: '', start_date: '', end_date: '', source: 'manual', external_id: '' });
      fetchBookings();
    } catch (err) {
      toast.error('Failed to add: ' + (err as Error).message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setDeletingBookingId(id);
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      toast.success('Booking removed');
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      toast.error('Failed to delete: ' + (err as Error).message);
    } finally {
      setDeletingBookingId(null);
    }
  };

  const getAccommodationName = (accId: string) => {
    const acc = accommodations.find((a) => a.id === accId);
    return acc ? (acc.name?.en || acc.slug) : accId;
  };

  const filteredBookings =
    bookingFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.accommodation_id === bookingFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand/20 pb-12">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-forest-dark">Metaxas Retreats CMS</h1>
          <Button variant="outline" onClick={handleLogout} className="text-gray-600">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Tabs defaultValue="accommodations">
          <TabsList className="mb-6">
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="bookings">
              Bookings
              {bookings.length > 0 && (
                <span className="ml-2 bg-forest text-white text-xs rounded-full px-2 py-0.5">
                  {bookings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Accommodations Tab ── */}
          <TabsContent value="accommodations">
            <div className="grid grid-cols-1 gap-8">
              {accommodations.map((acc, index) => (
                <Card key={acc.id} className="shadow-md">
                  <CardHeader className="bg-sand/30 border-b pb-4">
                    <CardTitle className="text-2xl text-sea-dark flex items-center justify-between">
                      {acc.name?.en} ({acc.slug})
                      <span className="text-sm font-normal bg-sea text-white px-3 py-1 rounded-full">
                        {acc.type}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-8">
                    {/* Pricing */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4">Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label>Base / Starting Price (€)</Label>
                          <Input
                            type="number"
                            value={acc.base_price}
                            onChange={(e) => handleFieldChange(index, 'base_price', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Guests</Label>
                          <Input disabled value={acc.guests} />
                        </div>
                      </div>

                      {/* Seasonal Prices */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-600">Seasonal Prices</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPriceRange(index)}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Season
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {acc.accommodation_prices.map((pr, pi) => (
                            <div key={pi} className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg">
                              <div className="flex-1 space-y-1">
                                <Label className="text-xs">Season</Label>
                                <Input
                                  placeholder="e.g. High Season"
                                  value={pr.season}
                                  onChange={(e) => handlePriceChange(index, pi, 'season', e.target.value)}
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <Label className="text-xs">Months</Label>
                                <Input
                                  placeholder="e.g. July, August"
                                  value={pr.months}
                                  onChange={(e) => handlePriceChange(index, pi, 'months', e.target.value)}
                                />
                              </div>
                              <div className="w-28 space-y-1">
                                <Label className="text-xs">Price (€)</Label>
                                <Input
                                  type="number"
                                  value={pr.price}
                                  onChange={(e) => handlePriceChange(index, pi, 'price', e.target.value)}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemovePriceRange(index, pi)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {acc.accommodation_prices.length === 0 && (
                            <p className="text-sm text-muted-foreground">No seasonal prices. Base price will be used.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t" />

                    {/* English */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center text-gray-700">
                        <span className="text-2xl mr-2">🇬🇧</span> English Content
                      </h3>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={acc.name?.en || ''}
                          onChange={(e) => handleFieldChange(index, 'name.en', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Input
                          value={acc.short_description?.en || ''}
                          onChange={(e) => handleFieldChange(index, 'short_description.en', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Full Description</Label>
                        <Textarea
                          rows={4}
                          value={acc.description?.en || ''}
                          onChange={(e) => handleFieldChange(index, 'description.en', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="border-t" />

                    {/* Greek */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center text-gray-700">
                        <span className="text-2xl mr-2">🇬🇷</span> Greek Content
                      </h3>
                      <div className="space-y-2">
                        <Label>Όνομα</Label>
                        <Input
                          value={acc.name?.el || ''}
                          onChange={(e) => handleFieldChange(index, 'name.el', e.target.value)}
                          placeholder="π.χ. Ξύλινο Σπίτι"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Σύντομη Περιγραφή</Label>
                        <Input
                          value={acc.short_description?.el || ''}
                          onChange={(e) => handleFieldChange(index, 'short_description.el', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Πλήρης Περιγραφή</Label>
                        <Textarea
                          rows={4}
                          value={acc.description?.el || ''}
                          onChange={(e) => handleFieldChange(index, 'description.el', e.target.value)}
                          placeholder="Περιγραφή στα Ελληνικά..."
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-end">
                    <Button
                      onClick={() => handleUpdate(index)}
                      disabled={savingId === acc.id}
                      className="bg-forest hover:bg-forest-dark"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {savingId === acc.id ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Bookings Tab ── */}
          <TabsContent value="bookings">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium">Filter by:</Label>
                <Select value={bookingFilter} onValueChange={setBookingFilter}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="All accommodations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All accommodations</SelectItem>
                    {accommodations.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name?.en || acc.slug}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={fetchBookings} title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setShowAddBooking(true)} className="bg-forest hover:bg-forest-dark">
                <CalendarOff className="h-4 w-4 mr-2" /> Add / Block Dates
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accommodation</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>External ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {getAccommodationName(booking.accommodation_id)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={SOURCE_COLORS[booking.source] || 'bg-gray-100 text-gray-700'}
                            variant="outline"
                          >
                            {SOURCE_LABELS[booking.source] || booking.source}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(parseISO(booking.start_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell>{format(parseISO(booking.end_date), 'dd MMM yyyy')}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {booking.external_id || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteBooking(booking.id)}
                            disabled={deletingBookingId === booking.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Booking Dialog */}
      <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Booking / Block Dates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Accommodation *</Label>
              <Select
                value={newBooking.accommodation_id}
                onValueChange={(v) => setNewBooking({ ...newBooking, accommodation_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation" />
                </SelectTrigger>
                <SelectContent>
                  {accommodations.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name?.en || acc.slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in *</Label>
                <Input
                  type="date"
                  value={newBooking.start_date}
                  onChange={(e) => setNewBooking({ ...newBooking, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Check-out *</Label>
                <Input
                  type="date"
                  value={newBooking.end_date}
                  onChange={(e) => setNewBooking({ ...newBooking, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={newBooking.source}
                onValueChange={(v) => setNewBooking({ ...newBooking, source: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Block</SelectItem>
                  <SelectItem value="direct">Direct Booking</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="booking">Booking.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>External ID (optional)</Label>
              <Input
                placeholder="e.g. Airbnb reservation ID"
                value={newBooking.external_id}
                onChange={(e) => setNewBooking({ ...newBooking, external_id: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBooking(false)}>Cancel</Button>
            <Button onClick={handleAddBooking} className="bg-forest hover:bg-forest-dark">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
