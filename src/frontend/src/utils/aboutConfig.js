const aboutConfig = [
  {
    id: 0,
    title: "What is TravelForge?",
    description:
      "TravelForge AI is a travel planning app that takes your destination, dates, and interests and turns them into a complete itinerary. It creates personalized daily plans, maps out routes, and keeps you informed with up-to-date weather, all in one place. In this application, it uses AI to help generate with the itinerary generation, alongside real routing and weather data to help make the plan more useful.",
  },
  {
    id: 1,
    title: "Found a bug or something went wrong?",
    description: `Send me an email at ${import.meta.env.VITE_CONTACT_EMAIL} and let me know what you were doing when it happened. If you have a screenshot, it will make it much easier to figure out what went wrong.`,
  },
  {
    id: 2,
    title: "Problem #1 Encountered: Auth Route Conflicts",
    description:
      "I ran into an issue where my custom auth routes were conflicting with the routes that better-auth had set up automatically. Additionally, OAuth logins weren’t carrying the cookies and headers through properly. I fixed it by separating the better-auth endpoints from my own auth logic, enabling returnHeaders: true, and passing the request headers through using fromNodeHeaders(req.headers) so the cookies would actually stick. For OAuth, I also had to use a redirect instead of returning the link directly, which gave the cookies a chance to be set first. Looking back, I should’ve mapped out the entire auth flow first and figured out what better-auth was already handling before adding my own routes.",
  },
  {
    id: 3,
    title: "Problem #2 Encountered: Session Cookie Not Clearing",
    description:
      "After deleting an account, the session cookie was still there, so the app could make it look like the user was still signed in. The delete endpoint wasn't returning the response headers needed to clear the session. I fixed that by enabling returnHeaders there and clearing the cookie on the frontend after deletion. Now I pay more attention to cookies whenever I'm working on anything that changes a user's session.",
  },
  {
    id: 4,
    title: "Problem #3 Encountered: Missing Schema Validation",
    description:
      "I didn't add schema validation early in the project, so I was relying on assumptions about what data my routes were receiving. That made some bugs harder to track down. I eventually added Zod schemas for things like authentication, tasks, and settings, which made the errors much easier to catch. If I were starting over, I'd create the schema alongside each route instead of adding validation later.",
  },
  {
    id: 5,
    title: "Problem #4 Encountered: Infinite Scroll Stopping",
    description:
      "The infinite scroll would sometimes stop loading even when there were still more items available. The problem was that the intersection observer wasn't reacting when the loading state changed. Adding isLoading to the effect dependencies fixed it. This was also a good reminder that I should test with slower network conditions, since the issue was barely noticeable on a fast connection.",
  },
  {
    id: 6,
    title: "Problem #5 Encountered: Invalid AI Responses",
    description:
      "Groq didn't always return the itinerary in exactly the format I expected. Sometimes the JSON was malformed or fields were missing, which caused problems later in the process. I added Zod validation to check the response and a retry when the generated data couldn't be parsed. If I were doing it again, I'd make the prompt even more strict and add a fallback earlier instead of assuming the AI response would always be valid.",
  },
  {
    id: 7,
    title: "Problem #6 Encountered: OSRM Route Failures",
    description:
      "The public OSRM server isn't guaranteed to be available all the time, so route requests would occasionally fail and leave the map without a route. I added a fallback route so the map could still show something instead of breaking completely. For a production version, I'd probably self-host OSRM or use a more reliable routing service.",
  },
  {
    id: 8,
    title: "Problem #7 Encountered: Docker Networking",
    description:
      "I had my database and n8n running in separate containers, but they couldn't communicate properly at first. I fixed it by putting the containers on a shared Docker network, which lets them connect using their service names instead of localhost. If I were setting it up again, I'd probably put the related services in the same Compose project at the beginning.",
  },
];

export default aboutConfig;
