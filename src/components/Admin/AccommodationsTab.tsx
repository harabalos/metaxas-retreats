import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Save, Image } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AccommodationRow, PriceRow } from './types';

interface Props {
  accommodations: AccommodationRow[];
  onRefresh: () => void;
}

const LANGS = [
  { code: 'en', flag: '🇬🇧', label: 'English', placeholder: 'e.g. Wooden House' },
  { code: 'el', flag: '🇬🇷', label: 'Greek', placeholder: 'π.χ. Ξύλινο Σπίτι' },
  { code: 'it', flag: '🇮🇹', label: 'Italian', placeholder: 'es. Casa in Legno' },
  { code: 'de', flag: '🇩🇪', label: 'German', placeholder: 'z.B. Holzhaus' },
  { code: 'ro', flag: '🇷🇴', label: 'Romanian', placeholder: 'ex. Casa din Lemn' },
];

const emptyNewAcc = {
  slug: '', type: 'house', base_price: 0, guests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  name: {} as Record<string, string>,
  short_description: {} as Record<string, string>,
  description: {} as Record<string, string>,
};

export default function AccommodationsTab({ accommodations, onRefresh }: Props) {
  const queryClient = useQueryClient();
  const [localAccs, setLocalAccs] = useState<AccommodationRow[]>(accommodations);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAcc, setNewAcc] = useState(emptyNewAcc);

  // Keep localAccs in sync when props change
  if (JSON.stringify(accommodations.map((a) => a.id)) !== JSON.stringify(localAccs.map((a) => a.id))) {
    setLocalAccs(accommodations);
  }

  const setField = (index: number, field: string, value: any) => {
    const updated = [...localAccs];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index] = { ...updated[index], [parent]: { ...(updated[index] as any)[parent], [child]: value } };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setLocalAccs(updated);
  };

  const setPriceField = (accIdx: number, priceIdx: number, field: keyof PriceRow, value: any) => {
    const updated = [...localAccs];
    const prices = [...updated[accIdx].accommodation_prices];
    prices[priceIdx] = { ...prices[priceIdx], [field]: field === 'price' ? Number(value) : value };
    updated[accIdx] = { ...updated[accIdx], accommodation_prices: prices };
    setLocalAccs(updated);
  };

  const handleSave = async (index: number) => {
    const acc = localAccs[index];
    setSavingId(acc.id);
    try {
      const { error } = await supabase.from('accommodations').update({
        base_price: acc.base_price,
        guests: acc.guests,
        bedrooms: acc.bedrooms,
        beds: acc.beds,
        bathrooms: acc.bathrooms,
        name: acc.name,
        short_description: acc.short_description,
        description: acc.description,
        amenities: acc.amenities,
        images: acc.images,
      }).eq('id', acc.id);
      if (error) throw error;

      await supabase.from('accommodation_prices').delete().eq('accommodation_id', acc.id);
      const toInsert = acc.accommodation_prices.filter((p) => p.season && p.months).map((p) => ({
        accommodation_id: acc.id, season: p.season, price: p.price, months: p.months,
      }));
      if (toInsert.length > 0) {
        const { error: priceErr } = await supabase.from('accommodation_prices').insert(toInsert);
        if (priceErr) throw priceErr;
      }
      toast.success(`${acc.name.en} saved!`);
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      onRefresh();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async () => {
    if (!newAcc.slug || !newAcc.name.en) {
      toast.error('Slug and English name are required');
      return;
    }
    setCreating(true);
    const { error } = await supabase.from('accommodations').insert({
      slug: newAcc.slug,
      type: newAcc.type,
      base_price: newAcc.base_price,
      guests: newAcc.guests,
      bedrooms: newAcc.bedrooms,
      beds: newAcc.beds,
      bathrooms: newAcc.bathrooms,
      name: newAcc.name,
      short_description: newAcc.short_description,
      description: newAcc.description,
      amenities: [],
      images: [],
    });
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Accommodation created!');
    setShowCreate(false);
    setNewAcc(emptyNewAcc);
    queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    onRefresh();
  };

  const addImage = (index: number) => {
    const url = window.prompt('Enter image URL:');
    if (!url) return;
    const updated = [...localAccs];
    updated[index] = { ...updated[index], images: [...(updated[index].images || []), url] };
    setLocalAccs(updated);
  };

  const removeImage = (accIdx: number, imgIdx: number) => {
    const updated = [...localAccs];
    updated[accIdx].images = updated[accIdx].images.filter((_, i) => i !== imgIdx);
    setLocalAccs(updated);
  };

  const addPrice = (index: number) => {
    const updated = [...localAccs];
    updated[index].accommodation_prices = [...updated[index].accommodation_prices, { season: '', price: 0, months: '' }];
    setLocalAccs(updated);
  };

  const removePrice = (accIdx: number, priceIdx: number) => {
    const updated = [...localAccs];
    updated[accIdx].accommodation_prices = updated[accIdx].accommodation_prices.filter((_, i) => i !== priceIdx);
    setLocalAccs(updated);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)} className="bg-forest hover:bg-forest-dark">
          <Plus className="h-4 w-4 mr-2" /> Add Accommodation
        </Button>
      </div>

      {localAccs.map((acc, index) => (
        <Card key={acc.id} className="shadow-md">
          <CardHeader className="bg-sand/30 border-b pb-4">
            <CardTitle className="text-xl text-forest-dark flex items-center justify-between">
              <span>{acc.name?.en} <span className="text-sm font-normal text-muted-foreground ml-2">({acc.slug})</span></span>
              <span className="text-xs font-normal bg-forest/10 text-forest px-3 py-1 rounded-full capitalize">{acc.type}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* Basic info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Base Price (€)', field: 'base_price', type: 'number' },
                  { label: 'Max Guests', field: 'guests', type: 'number' },
                  { label: 'Bedrooms', field: 'bedrooms', type: 'number' },
                  { label: 'Beds', field: 'beds', type: 'number' },
                  { label: 'Bathrooms', field: 'bathrooms', type: 'number' },
                ].map(({ label, field, type }) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-xs">{label}</Label>
                    <Input
                      type={type}
                      value={(acc as any)[field]}
                      onChange={(e) => setField(index, field, type === 'number' ? parseInt(e.target.value) : e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Prices */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Seasonal Prices</h3>
                <Button variant="outline" size="sm" onClick={() => addPrice(index)}>
                  <Plus className="h-3 w-3 mr-1" /> Add Season
                </Button>
              </div>
              <div className="space-y-2">
                {acc.accommodation_prices.map((pr, pi) => (
                  <div key={pi} className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1 space-y-1"><Label className="text-xs">Season</Label><Input placeholder="e.g. High Season" value={pr.season} onChange={(e) => setPriceField(index, pi, 'season', e.target.value)} /></div>
                    <div className="flex-1 space-y-1"><Label className="text-xs">Months</Label><Input placeholder="e.g. July, August" value={pr.months} onChange={(e) => setPriceField(index, pi, 'months', e.target.value)} /></div>
                    <div className="w-28 space-y-1"><Label className="text-xs">Price (€)</Label><Input type="number" value={pr.price} onChange={(e) => setPriceField(index, pi, 'price', e.target.value)} /></div>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removePrice(index, pi)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                {acc.accommodation_prices.length === 0 && <p className="text-sm text-muted-foreground">No seasonal prices — base price will be used.</p>}
              </div>
            </div>

            {/* Multilingual Content */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Content (all languages)</h3>
              <div className="space-y-6">
                {LANGS.map(({ code, flag, label }) => (
                  <div key={code} className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-medium text-sm flex items-center gap-2"><span className="text-xl">{flag}</span> {label}</h4>
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={acc.name?.[code] || ''} onChange={(e) => setField(index, `name.${code}`, e.target.value)} placeholder={LANGS.find((l) => l.code === code)?.placeholder} /></div>
                    <div className="space-y-1"><Label className="text-xs">Short Description</Label><Input value={acc.short_description?.[code] || ''} onChange={(e) => setField(index, `short_description.${code}`, e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Full Description</Label><Textarea rows={3} value={acc.description?.[code] || ''} onChange={(e) => setField(index, `description.${code}`, e.target.value)} /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Images</h3>
                <Button variant="outline" size="sm" onClick={() => addImage(index)}><Image className="h-3 w-3 mr-1" /> Add URL</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(acc.images || []).map((url, imgIdx) => (
                  <div key={imgIdx} className="relative group rounded-lg overflow-hidden border">
                    <img src={url} alt="" className="w-full h-24 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                    <button
                      onClick={() => removeImage(index, imgIdx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(acc.images || []).length === 0 && <p className="text-sm text-muted-foreground col-span-3">No images. Add image URLs.</p>}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-end">
            <Button onClick={() => handleSave(index)} disabled={savingId === acc.id} className="bg-forest hover:bg-forest-dark">
              <Save className="h-4 w-4 mr-2" /> {savingId === acc.id ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Create new accommodation dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Accommodation</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Slug * <span className="text-xs text-muted-foreground">(URL key, no spaces)</span></Label>
                <Input placeholder="e.g. wooden-house-6" value={newAcc.slug} onChange={(e) => setNewAcc((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g, '-') }))} />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={newAcc.type} onValueChange={(v) => setNewAcc((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="house">House</SelectItem><SelectItem value="tent">Tent</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">Base Price (€)</Label><Input type="number" value={newAcc.base_price} onChange={(e) => setNewAcc((f) => ({ ...f, base_price: parseInt(e.target.value) || 0 }))} /></div>
              <div className="space-y-1"><Label className="text-xs">Max Guests</Label><Input type="number" value={newAcc.guests} onChange={(e) => setNewAcc((f) => ({ ...f, guests: parseInt(e.target.value) || 1 }))} /></div>
              <div className="space-y-1"><Label className="text-xs">Bedrooms</Label><Input type="number" value={newAcc.bedrooms} onChange={(e) => setNewAcc((f) => ({ ...f, bedrooms: parseInt(e.target.value) || 1 }))} /></div>
            </div>
            {LANGS.map(({ code, flag, label, placeholder }) => (
              <div key={code} className="space-y-1 border-t pt-3">
                <Label className="text-sm font-medium">{flag} {label}</Label>
                <Input placeholder={`Name in ${label}`} value={newAcc.name[code] || ''} onChange={(e) => setNewAcc((f) => ({ ...f, name: { ...f.name, [code]: e.target.value } }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} className="bg-forest hover:bg-forest-dark">{creating ? 'Creating...' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
