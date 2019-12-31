import React from "react"
import { Chart } from "react-google-charts"

export default ({ data, height, options, width }) =>
  <div>
    <Chart
      chartType="PieChart"
      data={data}
      height={height}
      options={options}
      width={width}
    />
  </div>
