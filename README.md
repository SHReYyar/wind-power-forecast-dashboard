# Wind Power Forecast Monitoring Dashboard

## Overview

This project is a Next.js dashboard that compares actual vs forecasted wind power generation data.

## Features

* Displays Actual (Green) vs Forecast (Blue)
* Filters out null forecast values
* Supports Sample and Live API data
* Interactive time range and forecast horizon

## Tech Stack

* Next.js (App Router)
* TypeScript
* Recharts

## How to Run

```bash
npm install
npm run dev
```

Open:
http://localhost:3000

## Important Logic

Forecast values are filtered to ensure no null values are plotted:

```ts
chartData.filter(d => d.forecast !== null)
```

## Notes

* Sample mode is used if Live API fails
* Chart only renders valid forecast points
