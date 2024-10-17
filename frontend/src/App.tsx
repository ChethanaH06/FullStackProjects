import {useContext,lazy,Suspense} from 'react';
import { ThemeContext } from './context/theme.context';
import Navbar from './Components/navbar/Navbar.component';
import {Routes,Route} from "react-router-dom";
import CustomLinearLoader from './Components/Custom-linear-progress/CustomLinearLoader.component';

const Home=lazy(()=>import("./Components/pages/home/Home.Page"));
const Companies=lazy(()=>import("./Components/pages/companies/Companies.Page"));
const AddCompany=lazy(()=>import("./Components/pages/companies/AddCompany"));
const Jobs=lazy(()=>import("./Components/pages/jobs/Jobs.Pages"));
const AddJob=lazy(()=>import("./Components/pages/jobs/AddJob"));
const Candidates=lazy(()=>import("./Components/pages/candidates/Candidates.Pages"));
const AddCandidate=lazy(()=>import("./Components/pages/candidates/AddCandidate"));

const App = () => {
  const {darkMode}=useContext(ThemeContext);
  const appStyles=darkMode?"app dark":"app";
  return (
    <div className={appStyles}>
      <Navbar/>
      <div className='wrapper'>
        <Suspense fallback={<CustomLinearLoader/>}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/companies' >
              <Route index element={<Companies/>}/>
              <Route path='addCompany' element={<AddCompany/>}/>
          </Route>
          <Route path='/candidates' >
              <Route index element={<Candidates/>}/>
              <Route path='addCandidate' element={<AddCandidate/>}/>
          </Route>
          <Route path='/jobs' >
              <Route index element={<Jobs/>}/>
              <Route path='addJob' element={<AddJob/>}/>
            </Route>
        </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App;
