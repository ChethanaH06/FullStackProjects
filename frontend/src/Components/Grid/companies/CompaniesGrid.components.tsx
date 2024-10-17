import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Snackbar } from '@mui/material';
import moment from "moment";
import React, { useState } from 'react'
import { ICompany } from '../../../types/global.typing';
import './companies-grid.scss';
import httpModule from '../../../helper/http.module';
import { baseUrl } from '../../../constants/url.constants';
import { Delete } from '@mui/icons-material';

interface ICompaniesGridProps{
  data:ICompany[];
  onDelete:(id:number)=>void;
}

const CompaniesGrid = ({data,onDelete}:ICompaniesGridProps) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "info">("error");
  
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete job with ID ${id}?`
    );
    if (confirmDelete) {
      try {
        await httpModule.delete<ICompany>(`/Company/Delete/${id}`);
        onDelete(id);
        setAlertMessage("Company deleted successfully!!!");
        setSeverity("error");
        setOpen(true);
      } catch (error:any) {
        if (error.response && error.response.data === "Unable to delete the Company as Jobs are associated") {
          setAlertMessage("Unable to delete the Company as Jobs are associated");
        } else {
          setAlertMessage("Error deleting company.");
        }
        setSeverity("info");
        setOpen(true);
      }
    }
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
const column:GridColDef[]=[
    {field:"id",headerName:"ID",width:100},
    {field:"name",headerName:"Name",width:250},
    {field:"size",headerName:"Size",width:250},
    {field:"createdAt",headerName:"Creation Time",width:300,
        renderCell:(params)=>moment(params.row.createdAt).format("YYYY-MM-DD"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <a
          href={`${baseUrl}/Company/Delete/${params.row.Id}`}
          onClick={(e) => {
            e.preventDefault();
            handleDelete(params.row.id);
          }}
        >
          <Delete />
        </a>
      ),
    },
];

  return (
    <>
    <Box sx={{width:"100%",height:450}} className="companies-grid">
      <DataGrid 
        rows={data}
        columns={column}
        getRowId={(row)=>row.id}
        rowHeight={50}
      />
    </Box>
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CompaniesGrid;
