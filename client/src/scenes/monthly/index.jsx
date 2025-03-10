import React, { useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetSalesQuery } from "state/api";
import { ResponsiveLine } from "@nivo/line";

const Monthly = () => {
  const { data, isLoading } = useGetSalesQuery();
  const theme = useTheme();

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;
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

    const monthMap = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    const year = new Date().getFullYear(); // Pega o ano atual
    Object.values(monthlyData).forEach(({ month, totalSales, totalUnits }) => {
      const formattedMonth = `${year}-${monthMap[month] || "01"}-01`; // Define como "YYYY-MM-01"
      totalSalesLine.data.push({ x: formattedMonth, y: totalSales });
      totalUnitsLine.data.push({ x: formattedMonth, y: totalUnits });
    });

    const formattedData = [totalSalesLine, totalUnitsLine];
    return [formattedData];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
      <Box height="75vh">
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
            // curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: (value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
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

export default Monthly;
