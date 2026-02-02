

# Fix Calendar Sync: Add Airbnb iCal Source for Wooden House

## Problem Identified

Your calendar sync is missing bookings because:

1. **Current Setup**: The `AIRBNB_WOODEN_HOUSE_URL` secret is using a **Booking.com** iCal URL
2. **What Booking.com Exports**: Only its own confirmed bookings
3. **What's Missing**: 
   - Airbnb bookings (March 30-April 6, August 1-2)
   - Manual blocks you create

Booking.com's iCal export does NOT include dates that were blocked from other platforms, even if they sync correctly within Booking.com's own calendar display.

## Solution

Add support for **multiple iCal sources per accommodation** so the system fetches from BOTH Airbnb AND Booking.com.

## Implementation Steps

### 1. Add New Secret for Booking.com URL

Add a new secret `BOOKING_WOODEN_HOUSE_URL` to store the Booking.com iCal URL (which you currently have in `AIRBNB_WOODEN_HOUSE_URL`).

### 2. Update Existing Secret with Airbnb URL

Update `AIRBNB_WOODEN_HOUSE_URL` to use your actual Airbnb iCal export URL.

### 3. Modify Edge Function to Support Multiple Sources

Update `supabase/functions/sync-calendars/index.ts`:

```text
CALENDAR_URLS: Record<string, string[]> = {
  "wooden-house": [
    Deno.env.get("AIRBNB_WOODEN_HOUSE_URL") || "",
    Deno.env.get("BOOKING_WOODEN_HOUSE_URL") || ""  // NEW
  ],
  "glamping-tent-1": [Deno.env.get("AIRBNB_TENT_1_URL") || ""],
  "glamping-tent-2": [Deno.env.get("AIRBNB_TENT_2_URL") || ""]
};
```

### 4. Fix Duplicate Handling

When syncing from multiple sources, the same date range might appear in both feeds. Update the logic to:
- Collect all events from all sources first
- Use `upsert` with a composite key or deduplicate by date range before inserting

---

## Technical Details

### Edge Function Changes

```typescript
// Updated structure - support multiple URLs per accommodation
const CALENDAR_URLS: Record<string, string[]> = {
  "wooden-house": [
    Deno.env.get("AIRBNB_WOODEN_HOUSE_URL") || "",
    Deno.env.get("BOOKING_WOODEN_HOUSE_URL") || ""
  ].filter(url => url !== ""),  // Filter out empty URLs
  "glamping-tent-1": [Deno.env.get("AIRBNB_TENT_1_URL") || ""].filter(url => url !== ""),
  "glamping-tent-2": [Deno.env.get("AIRBNB_TENT_2_URL") || ""].filter(url => url !== "")
};
```

The existing loop already iterates over multiple URLs per accommodation (line 80: `for (const url of urls)`), so minimal changes needed.

### Deduplication Strategy

Use a Set to track unique date ranges before inserting:

```typescript
const seenDates = new Set<string>();
// For each event, create key like "2025-03-30_2025-04-06"
const dateKey = `${startDate}_${endDate}`;
if (seenDates.has(dateKey)) continue; // Skip duplicates
seenDates.add(dateKey);
```

---

## Required Secrets

| Secret Name | Current Value | New Value |
|------------|---------------|-----------|
| `AIRBNB_WOODEN_HOUSE_URL` | Booking.com URL | **Your Airbnb iCal URL** |
| `BOOKING_WOODEN_HOUSE_URL` | (new) | **Your current Booking.com iCal URL** |

---

## How to Get Your Airbnb iCal URL

1. Go to Airbnb Host Dashboard
2. Navigate to Calendar for Wooden House
3. Click "Availability settings" (gear icon)
4. Scroll to "Sync calendars" 
5. Click "Export calendar" to get the iCal URL

---

## Expected Result

After implementation:
- All 11 bookings will appear correctly blocked
- Airbnb bookings (March 30-April 6, Aug 1-2) will be captured
- Manual blocks will be captured from whichever platform you create them on
- No duplicate entries in the database

