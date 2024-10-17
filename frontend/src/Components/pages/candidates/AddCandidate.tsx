import React, { useState, useEffect } from "react";
import {
  ICreateCandidateDto,
  IJob
} from "../../../types/global.typing";
import "../candidates/candidates.scss";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import httpModule from "../../../helper/http.module";

const AddCandidate = () => {
  const [candidate, setCandidate] = useState<ICreateCandidateDto>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    jobId:"",
  });

  const [jobs, setJobs] = useState<IJob[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>();

  useEffect(() => {
    httpModule
      .get<IJob[]>("/Job/Get")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  }, []);

  const redirect = useNavigate();

  const handleClickSaveBtn = () => {
    if (
      candidate.firstName === "" ||
      candidate.lastName === "" ||
      candidate.email === "" ||
      candidate.phone === "" ||
      candidate.coverLetter === ""||
      candidate.jobId===""||
      !pdfFile
    ) {
      alert("Fill all the fields");
      return;
    }
    const newCandidateFormData=new FormData();
    newCandidateFormData.append("firstName",candidate.firstName);
    newCandidateFormData.append("lastName",candidate.lastName);
    newCandidateFormData.append("email",candidate.email);
    newCandidateFormData.append("phone",candidate.phone);
    newCandidateFormData.append("coverLetter",candidate.coverLetter);
    newCandidateFormData.append("jobId",candidate.jobId);
    newCandidateFormData.append("pdfFile",pdfFile);
    httpModule
      .post("/Candidate/Create", newCandidateFormData)
      .then((response) =>{
        redirect("/candidates",{state:{success:true}});
      }) 
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/candidates");
  };

  return (
    <div className="content">
      <div className="add-candidate">
        <h2>Add new Candidate</h2>

        <FormControl fullWidth>
          <InputLabel> Job </InputLabel>
          <Select
            value={candidate.jobId}
            variant="outlined"
            label="Job Title"
            onChange={(e) =>
              setCandidate({ ...candidate, jobId: e.target.value })
            }
          >
            {jobs.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoComplete="off"
          label="First Name"
          variant="outlined"
          value={candidate.firstName}
          onChange={(e) =>
            setCandidate({ ...candidate, firstName: e.target.value })
          }
        />
        <TextField
          autoComplete="off"
          label="Last Name"
          variant="outlined"
          value={candidate.lastName}
          onChange={(e) =>
            setCandidate({ ...candidate, lastName: e.target.value })
          }
        />
        <TextField
          autoComplete="off"
          label="Email"
          variant="outlined"
          value={candidate.email}
          onChange={(e) =>
            setCandidate({ ...candidate, email: e.target.value })
          }
        />
        <TextField
          autoComplete="off"
          label="Phone"
          variant="outlined"
          value={candidate.phone}
          onChange={(e) =>
            setCandidate({ ...candidate, phone: e.target.value })
          }
        />
        <TextField
          autoComplete="off"
          label="C V"
          variant="outlined"
          value={candidate.coverLetter}
          multiline
          onChange={(e) =>
            setCandidate({ ...candidate, coverLetter: e.target.value })
          }
        />
        <input
          type="file"
          onChange={(event) =>
            setPdfFile(event.target.files ? event.target.files[0] : null)
          }
        />

        <div className="btns">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClickSaveBtn}
          >
            Save
          </Button>
          &nbsp; &nbsp;
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClickBackBtn}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddCandidate;
