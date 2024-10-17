import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box,Snackbar,Alert } from '@mui/material';
import moment from "moment";
import { IJob } from '../../../types/global.typing';
import './jobs-grid.scss';
import { useState } from 'react';
import httpModule from '../../../helper/http.module';
import { baseUrl } from '../../../constants/url.constants';
import { Delete } from '@mui/icons-material';

interface IJobsGridProps{
  data:IJob[];
  onDelete: (id: number) => void; 
}

const JobsGrid = ({data,onDelete}:IJobsGridProps) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "info">("error");

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete job with ID ${id}?`
    );
    if (confirmDelete) {
      try {
        await httpModule.delete<IJob>(`/Job/Delete/${id}`);
        onDelete(id);
        setAlertMessage("Job deleted successfully!!!");
        setSeverity("error");
        setOpen(true);
      } catch (error:any) {
        if (error.response && error.response.data === "Unable to delete job as there are candidates associated with this job.") {
          setAlertMessage("Unable to delete job as there are candidates associated with this job.");
        } else {
          setAlertMessage("Error deleting job.");
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
    {field:"companyName",headerName:"Company Name",width:150},
    {field:"title",headerName:"Title",width:200},
    {field:"level",headerName:"Level",width:150},
    {field:"createdAt",headerName:"Creation Time",width:300,
        renderCell:(params)=>moment(params.row.createdAt).fromNow(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <a
          href={`${baseUrl}/Job/Delete/${params.row.Id}`}
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
    <Box sx={{width:"100%",height:450}} className="jobs-grid">
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

export default JobsGrid;
