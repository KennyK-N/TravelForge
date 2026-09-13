export default function buildTripPlannerPrompt({
  startDate,
  endDate,
  toCity,
  toCountry,
  interests = [],
}) {
  const normalizedInterests = Array.isArray(interests)
    ? interests
        .filter(
          (interest) =>
            typeof interest === "string" && interest.trim().length > 0,
        )
        .map((interest) => interest.trim())
        .slice(0, 10)
    : [];

  return `
Generate a practical travel itinerary.

Trip:
- Dates: ${startDate} to ${endDate}, inclusive
- Destination: ${toCity}, ${toCountry}
- Interests: ${JSON.stringify(normalizedInterests)}

Return only valid JSON matching the provided schema.
Do not include Markdown, explanations, or extra text.

The JSON must have exactly this top-level shape:
{
  "itinerary": []
}

Rules:
1. Generate exactly one itinerary object for each calendar date from ${startDate} to ${endDate}, inclusive.
   - Do not skip any date.
   - The first itinerary date must be ${startDate}.
   - The last itinerary date must be ${endDate}.

2. Each itinerary object must contain exactly these properties:
   - title
   - subtitles
   - date
   - places
   - summary
   - description
   - coordinates
   - time

3. Never omit any required property.
   - Every itinerary object must include "time".
   - Every itinerary object must include "coordinates".
   - Do not include extra properties.

4. Each day must have a varied number of scheduled activities.
   - Randomly choose 1, 2, or 3 activities for each day.
   - Do not use the same number of activities every day unless the trip is only one day.
   - Use fewer activities on the first and last day when possible.
   - Do not fill the entire day.
   - Leave free time for meals, transportation, rest, and exploration.

5. These arrays must have the same number of items:
   - subtitles
   - places
   - description
   - coordinates
   - time

6. Each matching index represents one activity:
   - subtitles[i] is a short label for the activity.
   - places[i] is the specific real location.
   - description[i] briefly explains the activity.
   - coordinates[i] contains the coordinates for places[i].
   - time[i] contains the time block for that activity.

7. Date rules:
   - date must use YYYY-MM-DD format.
   - Each itinerary item must use the correct calendar date.
   - Dates must be in order from ${startDate} to ${endDate}.

8. Time rules:
   - time must be an array of strings.
   - Each time must use exactly this format: HH:mm-HH:mm
   - Example: "09:00-10:30"
   - Use a 24-hour clock.
   - Times must be chronological.
   - Times must not overlap.
   - Allow realistic travel time between activities.

9. Coordinate rules:
   - coordinates must be an array of objects.
   - Each coordinate object must match the place at the same index.
   - Each coordinate object must contain exactly these two properties:
     - latitude
     - longitude
   - latitude must be a number between -90 and 90.
   - longitude must be a number between -180 and 180.
   - Never use strings for coordinates.
   - Never use placeholder values such as 0 or null.
   - Never use arrays like [longitude, latitude].
   - Never use property names like lat, lng, or lattitude.

Correct coordinate example:
{ "latitude": 49.2827, "longitude": -123.1207 }

10. Keep locations geographically close when possible.

11. If interests are provided, include at least one suitable activity for each interest across the full trip.

12. Keep text brief and within these character limits:
   - title: maximum 35 characters
   - subtitles: maximum 45 characters each
   - places: maximum 80 characters each
   - summary: maximum 45 characters
   - description: maximum 60 characters each

13. Use real attractions, restaurants, parks, museums, neighborhoods, or areas.
   - Do not invent fake places.
   - Do not invent fake events.

Final validation before returning:
- Every itinerary object has title, subtitles, date, places, summary, description, coordinates, and time.
- Every subtitles array length matches places, description, coordinates, and time.
- Every title is 35 characters or less.
- Every subtitle is 45 characters or less.
- Every place is 80 characters or less.
- Every summary is 45 characters or less.
- Every description is 60 characters or less.
- No date is missing between ${startDate} and ${endDate}.
`.trim();
}
