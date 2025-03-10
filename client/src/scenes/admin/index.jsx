import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useGetAdminsQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";

const Admin = () => {
  const theme = useTheme();

  // Update query to include pagination params
  const { data, isLoading } = useGetAdminsQuery();

  const admins = Array.isArray(data?.admins) ? data.admins : [];
  const totalCount = admins.length;

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
  ];

  if (!data && !isLoading) return <div>Error loading data</div>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing admins and list of admins" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={admins}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row._id}
          pagination
          paginationMode="server"
          // page={page}
          // pageSize={pageSize}
          rowCount={totalCount}
          slots={{
            columnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default Admin;
