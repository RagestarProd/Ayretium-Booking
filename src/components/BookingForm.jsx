"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // or useRouter from next/router if pages directory
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"

export default function BookingForm() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, time, description }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Booking created!");
      router.push("/dashboard/bookings"); // redirect to bookings page or anywhere
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to create booking");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl p-4">
      <label>
        Date
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Time
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>

      <label>
        Description (optional)
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create Booking"}
      </Button>
    </form>
  );
}
