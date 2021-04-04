---
title: Hello, world notebook.
date: Last Modified
permalink: /notebook1/index.html
eleventyNavigation:
  key: notebook1
  order: 0
  title: Notebook1
---





# 💹 Visualizing Exchange Rate Data

In this notebook we will visualize the US Dollar to Euro exchange rate using the **[exchangerate.host](https://exchangerate.host/)** API.\
After that we will also create a simple currency calculator.

> Tip: Press the ▶ Play button on the left to run a cell.






```javascript {"run_on_load":true,"collapsed":true}
const today = new Date().toISOString().slice(0,10); // Today in yyyy-mm-dd format
const data = await fetch(`https://api.exchangerate.host/timeseries?start_date=2020-01-01&end_date=${today}`);

// var puts it in the global scope (so we can use it in the next cell)
runtime.variables.jsonData = await data.json();

```
```javascript {"run_on_load":true}
// Chart.js creates a global `Chart` object when it is loaded.
await import("https://unpkg.com/chart.js@2.9.3/dist/Chart.bundle.min.js");

const canvas = document.createElement("canvas");
const rates = runtime.variables.jsonData.rates;
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