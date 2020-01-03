import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
// import { useGeolocation } from "react-use";
// import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import MultipleSelect from "./MultipleSelect";
import Chart from "./Chart";

const useStyles = makeStyles({
  card: {
    margin: "1%"
  }
});

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const fetMetricsQuery = `
{
  getMetrics
}
`;

const fetchData = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input)  {
    metric,
    measurements{
      at,
      value,
      metric,
      unit
    }
  }
}
`;

const getMetrics = state => {
  const { metrics } = state.dashboard;
  return {
    metrics
  };
};

const getMeasurements = state => {
  const { measurements } = state.dashboard;
  return {
    measurements
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Dashboard />
    </Provider>
  );
};

const Dashboard = () => {
  const classes = useStyles();

  const [selectedMetrics, setSelectedMetrics] = React.useState([]);

  const dispatch = useDispatch();
  const { metrics } = useSelector(getMetrics);
  const { measurements } = useSelector(getMeasurements);

  const onSelectChange = value => {
    var input =
      value && value.length
        ? value.map(s => {
            var dt = new Date();
            dt.setMinutes(dt.getMinutes() - 30); // take last 30 Minutes data
            return {
              metricName: s,
              after: dt.getTime()
            };
          })
        : [];
    setSelectedMetrics(input);
  };

  const [result] = useQuery({
    query: fetMetricsQuery,
    variables: {}
  });
  const { fetching, data, error } = result;

  const [result2] = useQuery({
    query: fetchData,
    variables: {
      input: selectedMetrics
    }
  });

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch({ type: actions.METRICS_DATA_RECEIVED, getMetrics });
  }, [dispatch, data, error]);

  useEffect(() => {
    if (result2.error) {
      dispatch({ type: actions.API_ERROR, error: result2.error.message });
      return;
    }
    if (!result2.data) return;
    const { getMultipleMeasurements } = result2.data;
    dispatch({
      type: actions.MEASUREMENTS_DATA_RECEIVED,
      getMultipleMeasurements
    });
  }, [result2]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <MultipleSelect names={metrics} onSelectChange={onSelectChange} />
        <Chart measurements={measurements} />
      </CardContent>
    </Card>
  );
};
