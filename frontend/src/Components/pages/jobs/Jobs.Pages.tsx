import React, { useEffect, useState } from "react";
import "./jobs.scss";
import httpModule from "../../../helper/http.module";
import { IJob } from "../../../types/global.typing";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {Add} from "@mui/icons-material";
import JobsGrid from "../../Grid/jobs/JobsGrid.components";

const Jobs = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const redirect=useNavigate();

  useEffect(() => {
    setloading(true);
    httpModule
      .get<IJob[]>("/Job/Get")
      .then((response) => {
        setJobs(response.data);
        setloading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setloading(false);
      });
  }, []);

useEffect(() => {
    if (location.state && location.state.success) {
      setOpen(true);
    }
  }, [location.state]);

  const handleDelete = (id: number) => {
    const updatedJobs = jobs.filter((job) => job.id !== id); 
    setJobs(updatedJobs);
};

const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
if (reason === "clickaway") {
  return;
}
setOpen(false);
};
  return (
  <div className="content jobs">
    <div className="heading">
      <h2>Jobs</h2>
      <Button variant="outlined" onClick={()=>redirect("/jobs/addJob")}>
        <Add/>
      </Button>
    </div>
    {loading?(
      <CircularProgress size={60}/>
    ):jobs.length===0?(
      <h1>No Jobs </h1>
    ):(
      <JobsGrid data={jobs} onDelete={handleDelete} />
    )}
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Job added successfully!!!
        </Alert>
      </Snackbar>
  </div>
  );
};

export default Jobs;
