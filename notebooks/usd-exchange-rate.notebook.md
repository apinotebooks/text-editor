---
title: Hello, world notebook.
date: Last Modified
permalink: /notebook1/index.html
eleventyNavigation:
  key: notebook1
  order: 0
  title: Notebook1
---

# 💹 USD Exchange Rate

In this notebook we will visualize the US Dollar to Euro exchange rate using the **[exchangerate.host](https://exchangerate.host/)** API.\
After that we will also create a simple currency calculator.

```javascript {"run_on_load":true,"collapsed":true}
const today = new Date();
const endDate = today.toISOString().slice(0,10); // endDate in yyyy-mm-dd format
var startDate = today;
startDate.setDate(startDate.getDate() - 90);     // startDate 90 days in the past
startDate = startDate.toISOString().slice(0,10); // startDate in yyyy-mm-dd format

// call exchangerate.host API
const data = await fetch(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}`);

// extract rates data
const jsonData = await data.json();
const rates = jsonData.rates;

// Chart.js creates a global `Chart` object when it is loaded.
await import("https://unpkg.com/chart.js@2.9.3/dist/Chart.bundle.min.js");

const canvas = document.createElement("canvas");
const currencyChart = new Chart(canvas.getContext("2d"),
    {
        type: "line",
        data: {
            labels: Object.keys(rates),
            datasets: [{
                label: 'Euro - US Dollar',
                data: Object.values(rates).map(c => c.USD),
                borderColor: "#5558ff",
                backgroundColor: "#5558ff80",
            }],
        },
    },
);

canvas
```