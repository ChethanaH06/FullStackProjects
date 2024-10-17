import React, { useEffect, useState } from "react";
import "./candidates.scss";
import httpModule from "../../../helper/http.module";
import { ICandidate } from "../../../types/global.typing";
import { Button, CircularProgress,Snackbar,Alert} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {Add} from "@mui/icons-material";
import CandidatesGrid from "../../Grid/candidates/CandidatesGrid.components";

const Candidates = () => {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const redirect=useNavigate();

  useEffect(() => {
    setloading(true);
    httpModule
      .get<ICandidate[]>("/Candidate/Get")
      .then((response) => {
        setCandidates(response.data);
        setloading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setloading(false)
      });
  }, []);

  useEffect(() => {
    if (location.state && location.state.success) {
      setOpen(true);
    }
  }, [location.state]);

  const handleDelete = (id: number) => {
        const updatedCandidates = candidates.filter((candidate) => candidate.id !== id); 
        setCandidates(updatedCandidates);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
 
  return (
  <div className="content candidates">
    <div className="heading">
      <h2>Candidates</h2>
      <Button variant="outlined" onClick={()=>redirect("/candidates/addCandidate")}>
        <Add/>
      </Button>
    </div>
    {loading?(
      <CircularProgress size={100}/>
    ):candidates.length===0?(
      <h1>No Candidate </h1>
    ):(
      <CandidatesGrid data={candidates} onDelete={handleDelete} />
    )}
     <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Candidate added successfully!!!
        </Alert>
      </Snackbar>
  </div>
  );
};

export default Candidates;
