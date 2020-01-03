import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import _ from "lodash";
import moment from "moment";

const randomColor = () =>
  `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`;

export default function Chart(props) {
  const mergedObjects = [];

  if (!props.measurements || !props.measurements.length)
    return <div>Select metric to load chart data</div>;

  _.forEach(props.measurements[0].measurements, function(item, index) {
    const measurements = _.map(props.measurements, "measurements");

    let mergedItem = {};

    _.forEach(measurements, function(value) {
      mergedItem = {
        ...mergedItem,
        ...value[index],
        [value[index].metric]: value[index].value,
        atValue: moment(value[index].at).format("LT")
      };
    });

    mergedObjects.push(mergedItem);
  });

  const finalData = _.sortBy(mergedObjects, ["at"]).filter(m => m.value >= 0);

  return (
    <LineChart
      width={1024}
      height={500}
      data={finalData}
      margin={{
        top: 50,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="atValue" />
      {props.measurements.map((d, i) => (
        <YAxis yAxisId={i} key={i} />
      ))}
      <Tooltip />
      <Legend />
      {props.measurements.map((d, i) => (
        <Line
          yAxisId={i}
          key={i}
          type="monotone"
          dataKey={d.metric}
          dot={false}
          stroke={randomColor()}
        />
      ))}
    </LineChart>
  );
}
