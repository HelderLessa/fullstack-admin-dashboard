import React, { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetSalesQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ResponsiveLine } from "@nivo/line";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const { data, isLoading } = useGetSalesQuery();
  const theme = useTheme();

  const formattedData = useMemo(() => {
    if (
      !data ||
      !data.dailyData ||
      !Array.isArray(data.dailyData) ||
      data.dailyData.length === 0
    ) {
      return [];
    }

    const { dailyData } = data;
    const year = data.year || 2021;

    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };

    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
    };

    // Process each data point with synthetic dates
    dailyData.forEach((dailyData, index) => {
      if (
        !dailyData ||
        (dailyData.totalSales === undefined &&
          dailyData.totalUnits === undefined)
      ) {
        return;
      }

      // Create a date for this day (assuming array index 0 = Jan 1, index 1 = Jan 2, etc.)
      const dateObj = new Date(year, 0); // Start with Jan 1
      dateObj.setDate(dateObj.getDate() + index); // Add days

      // Check if date is within selected range
      if (dateObj >= startDate && dateObj <= endDate) {
        const formattedDate = dateObj.toISOString().split("T")[0];

        if (dailyData.totalSales !== undefined) {
          totalSalesLine.data.push({
            x: formattedDate,
            y: dailyData.totalSales,
          });
        }

        if (dailyData.totalUnits !== undefined) {
          totalUnitsLine.data.push({
            x: formattedDate,
            y: dailyData.totalUnits,
          });
        }
      }
    });

    // Only return lines that have data
    const result = [];
    if (totalSalesLine.data.length > 0) result.push(totalSalesLine);
    if (totalUnitsLine.data.length > 0) result.push(totalUnitsLine);

    return result;
  }, [data, startDate, endDate, theme.palette.secondary]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box mr={2}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
            />
          </Box>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
            />
          </Box>
        </Box>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            Loading...
          </Box>
        ) : formattedData.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <div>No data available for the selected date range</div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "0.9rem",
                color: theme.palette.secondary[300],
              }}
            >
              Try adjusting the date range to include data from{" "}
              {data?.year || 2021}
            </div>
          </Box>
        ) : (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            enableGridX={false}
            enableGridY={false}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: (value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              },
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: "Date",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
              truncateTickAt: 0,
            }}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel="y"
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        )}
      </Box>
    </Box>
  );
};

export default Daily;
