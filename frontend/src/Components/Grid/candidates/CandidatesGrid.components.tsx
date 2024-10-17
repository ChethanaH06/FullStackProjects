import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Snackbar, Alert } from "@mui/material";
import { ICandidate } from "../../../types/global.typing";
import { baseUrl } from "../../../constants/url.constants";
import { PictureAsPdf } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import "./candidates-grid.scss";
import httpModule from "../../../helper/http.module";

interface ICandidatesGridProps {
  data: ICandidate[];
  onDelete: (id: number) => void;
}

const CandidatesGrid = ({ data, onDelete }: ICandidatesGridProps) => {
  const [open, setOpen] = useState(false);
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete candidate with ID ${id}?`
    );
    if (confirmDelete) {
      try {
        await httpModule.delete<ICandidate>(`/Candidate/Delete/${id}`);
        onDelete(id);
        setOpen(true);
      } catch (error) {
        console.error("Error deleting candidate:", error);
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

  const column: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstName", headerName: "FirstName", width: 120 },
    { field: "lastName", headerName: "LastName", width: 20 },
    { field: "email", headerName: "Email Id", width: 150 },
    { field: "phone", headerName: "Phone No", width: 150 },
    { field: "coverLetter", headerName: "Cover Letter", width: 300 },
    {
      field: "resumeUrl",
      headerName: "Download",
      width: 150,
      renderCell: (params) => (
        <a
          href={`${baseUrl}/Candidate/download/${params.row.resumeUrl}`}
          download
        >
          <PictureAsPdf />
        </a>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <a
          href={`${baseUrl}/Candidate/Delete/${params.row.Id}`}
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
      <Box sx={{ width: "100%", height: 450 }} className="candidates-grid">
        <DataGrid
          rows={data}
          columns={column}
          getRowId={(row) => row.id}
          rowHeight={50}
        />
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Candidate deleted successfully!!!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CandidatesGrid;
