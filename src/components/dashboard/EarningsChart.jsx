'use client';

import { useState } from 'react';

export default function EarningsChart({ data = [] }) {
  const [timeframe, setTimeframe] = useState('month');

  // Mock data - in real app, fetch from API
  const mockData = {
    week: [
      { day: 'Mon', earnings: 120 },
      { day: 'Tue', earnings: 85 },
      { day: 'Wed', earnings: 200 },
      { day: 'Thu', earnings: 150 },
      { day: 'Fri', earnings: 300 },
      { day: 'Sat', earnings: 180 },
      { day: 'Sun', earnings: 95 }
    ],
    month: [
      { day: 'Week 1', earnings: 850 },
      { day: 'Week 2', earnings: 1200 },
      { day: 'Week 3', earnings: 950 },
      { day: 'Week 4', earnings: 1400 }
    ],
    year: [
      { day: 'Jan', earnings: 3200 },
      { day: 'Feb', earnings: 2800 },
      { day: 'Mar', earnings: 3500 },
      { day: 'Apr', earnings: 4200 },
      { day: 'May', earnings: 3800 },
      { day: 'Jun', earnings: 4500 }
    ]
  };

  const currentData = mockData[timeframe] || mockData.month;
  const maxEarnings = Math.max(...currentData.map(d => d.earnings));

  return (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'year'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeframe === tf
                ? 'bg-primary text-white'
                : 'bg-neutral-100 dark:bg-neutral-700 text-muted-foreground hover:bg-neutral-200 dark:hover:bg-neutral-600'
            }`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48 flex items-end justify-between gap-2">
        {currentData.map((item, index) => (
          <div key={item.day} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-t-lg relative group">
              <div
                className="bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all duration-300 group-hover:from-primary-dark group-hover:to-primary"
                style={{ height: `${(item.earnings / maxEarnings) * 100}%` }}
              ></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                ${item.earnings}
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-2 text-center">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div>
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <p className="text-xl font-bold text-foreground">
            ${currentData.reduce((sum, item) => sum + item.earnings, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="text-lg font-semibold text-foreground">
            ${Math.round(currentData.reduce((sum, item) => sum + item.earnings, 0) / currentData.length)}
          </p>
        </div>
      </div>
    </div>
  );
} 