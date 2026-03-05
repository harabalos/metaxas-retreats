import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Setting } from './types';

interface Props {
  settings: Setting[];
  onRefresh: () => void;
}

type SettingsMap = Record<string, string>;

const SECTIONS = [
  {
    title: '📞 Contact Info',
    keys: [
      { key: 'contact_address', label: 'Address', type: 'text' },
      { key: 'contact_phone_1', label: 'Phone 1', type: 'text' },
      { key: 'contact_phone_2', label: 'Phone 2 (optional)', type: 'text' },
      { key: 'contact_email', label: 'Email', type: 'email' },
      { key: 'contact_whatsapp_1', label: 'WhatsApp 1 (with country code, no spaces)', type: 'text' },
      { key: 'contact_whatsapp_2', label: 'WhatsApp 2 (optional)', type: 'text' },
    ],
  },
  {
    title: '🏦 Bank Account (for direct payments)',
    keys: [
      { key: 'bank_name', label: 'Bank Name', type: 'text' },
      { key: 'bank_holder', label: 'Account Holder Name', type: 'text' },
      { key: 'bank_iban', label: 'IBAN', type: 'text' },
      { key: 'bank_bic', label: 'BIC / SWIFT', type: 'text' },
      { key: 'bank_note', label: 'Payment Note (shown to guests)', type: 'textarea' },
    ],
  },
  {
    title: '🔔 Notifications',
    keys: [
      { key: 'notification_email', label: 'Notification Email (for new inquiries)', type: 'email' },
    ],
  },
];

export default function SettingsTab({ settings, onRefresh }: Props) {
  const [map, setMap] = useState<SettingsMap>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const m: SettingsMap = {};
    settings.forEach((s) => { m[s.key] = s.value || ''; });
    setMap(m);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(map)) {
        const { error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
        if (error) throw error;
      }
      toast.success('Settings saved!');
      onRefresh();
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {SECTIONS.map((section) => (
        <Card key={section.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.keys.map(({ key, label, type }) => (
              <div key={key} className="space-y-1">
                <Label className="text-sm">{label}</Label>
                {type === 'textarea' ? (
                  <Textarea
                    rows={2}
                    value={map[key] || ''}
                    onChange={(e) => setMap((m) => ({ ...m, [key]: e.target.value }))}
                  />
                ) : (
                  <Input
                    type={type}
                    value={map[key] || ''}
                    onChange={(e) => setMap((m) => ({ ...m, [key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="bg-forest hover:bg-forest-dark">
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">👥 Team Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            To add or remove team members, manage users directly in your{' '}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Supabase dashboard
            </a>{' '}
            → Authentication → Users.
          </p>
          <p className="text-sm text-muted-foreground">
            Each user needs an account in Supabase Auth to log into the portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
