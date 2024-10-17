import React, { useEffect, useState } from "react";
import "./Companies.scss";
import httpModule from "../../../helper/http.module";
import { ICompany } from "../../../types/global.typing";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {Add} from "@mui/icons-material";
import CompaniesGrid from "../../Grid/companies/CompaniesGrid.components";

const Companies = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const redirect=useNavigate();

  useEffect(() => {
    setloading(true);
    httpModule
      .get<ICompany[]>("/Company/Get")
      .then((response) => {
        setCompanies(response.data);
        setloading(false);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
        setloading(false);
      });
  }, []);

  useEffect(()=>{
    if(location.state && location.state.success){
      setOpen(true);
    }
  },[location.state]);

  const handleDelete=(id:number)=>{
    const updatedCampanies=companies.filter((company)=>company.id!==id);
    setCompanies(updatedCampanies);
  }

  const handleClose=(event?:React.SyntheticEvent|Event,reason?:string)=>{
    if(reason==="clickaway"){
      return;
    }
    setOpen(false);
  };

  return (
  <div className="content companies">
    <div className="heading">
      <h2>Companies</h2>
      <Button variant="outlined" onClick={()=>redirect("/companies/addCompany")}>
        <Add/>
      </Button>
    </div>
    {loading?(
      <CircularProgress size={60}/>
    ):companies.length===0?(
      <h1>No Company </h1>
    ):(
      <CompaniesGrid data={companies} onDelete={handleDelete}/>
    )}
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Job added successfully!!!
        </Alert>
      </Snackbar>
  </div>
  );
};

export default Companies;
