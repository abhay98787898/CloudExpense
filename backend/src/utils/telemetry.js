import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import config from "../config.js";

const client = new CloudWatchClient({ region: config.region });

export async function publishMetric(metricName, value = 1) {
  try {
    await client.send(new PutMetricDataCommand({
      Namespace: config.cloudWatchNamespace,
      MetricData: [{ MetricName: metricName, Unit: "Count", Value: value, Timestamp: new Date() }],
    }));
  } catch (error) {
    // Telemetry must never make the main user operation fail.
    console.warn(`CloudWatch metric ${metricName} was not published:`, error.message);
  }
}
