'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EventList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState<string>("dhanbad");

  const fetchEvents = async (searchPlace: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/recommend?place=${encodeURIComponent(searchPlace)}`);
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(place);
  }, []);

  const handleSearch = () => {
    if (place.trim()) {
      fetchEvents(place);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="mb-6 flex gap-2">
        <input 
          type="text" 
          value={place} 
          onChange={(e) => setPlace(e.target.value)} 
          placeholder="Enter place..." 
          className="border p-2 rounded w-full"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {events.length === 0 && !loading ? (
        <p>No events found.</p>
      ) : (
        events.map((event, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              {event.image && (
                <Image src={event.image} alt={event.title} width={500} height={300} className="rounded-lg" />
              )}
              {event.thumbnail && (
                <Image src={event.thumbnail} alt={event.title} width={500} height={300} className="rounded-lg" />
              )}
            </div>
            <h2 className="text-2xl font-semibold mt-4">{event.title}</h2>
            <p className="text-gray-600 mt-2">{event.date || "Date not available"}</p>
            <p className="mt-2">
              <strong>Venue:</strong> {" "}
              {event.address ? (
                <Link href={`https://www.google.com/search?q=${encodeURIComponent(event.address)}`} className="text-blue-500">
                  {event.address}
                </Link>
              ) : (
                "Venue not available"
              )}
            </p>
            <p className="mt-2">{event.description || "No description available."}</p>
            <div className="mt-4">
              <Link href={event.link || "#"} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Event Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
