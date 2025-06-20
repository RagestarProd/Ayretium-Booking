import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setMessage2(data.message);
    } catch (error) {
      console.error('API error:', error);
      setMessage2('Failed to fetch message');
    }
    setLoading(false);
  };


  const handleClickCal = async (datain) => {
    setLoading(true);
    setMessage2(JSON.stringify(datain));
    setLoading(false);
  };

  useEffect(() => {
    // Fetch data from the API route
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('API error:', err));
  }, []);

  

  return (
    <div class="p-5">
      <h1>Next.js API Example</h1>
      <p>Message from API: {message}</p>
      <Button variant="outline">Click!</Button>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Get Message'}
      </Button>
      
      <Calendar
        mode="single"
        className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
        captionLayout="dropdown"
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6
            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props} onClick={() => handleClickCal({day})}>
                {children}
                {!modifiers.outside && <span>{isWeekend ? "$220" : "$100"}</span>}
              </CalendarDayButton>
            )
          },
        }}
      />
      <p>Message from API:
         {message2}
      </p>
      <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">Accept terms and conditions</Label>
          <p className="text-muted-foreground text-sm">
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="toggle" disabled />
        <Label htmlFor="toggle">Enable notifications</Label>
      </div>
      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          id="toggle-2"
          defaultChecked
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            Enable notifications
          </p>
          <p className="text-muted-foreground text-sm">
            You can enable or disable notifications at any time.
          </p>
        </div>
      </Label>
    </div>
    </div>
  );
}