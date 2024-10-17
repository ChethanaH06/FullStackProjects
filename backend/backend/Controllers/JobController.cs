using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Company;
using backend.Core.Dtos.Job;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        private IMapper _mapper;
        public JobController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //CRUD
        //Create
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateJob([FromBody] JobCreateDto dto)
        {
            var newJob = _mapper.Map<Job>(dto);
            await _context.Jobs.AddAsync(newJob);
            await _context.SaveChangesAsync();
            return Ok("Job created successfully");
        }
        //Read
        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<JobGetDto>>> GetJobs()
        {
            var jobs = await _context.Jobs.Include(job=>job.Company).ToListAsync();
            var convjob = _mapper.Map<IEnumerable<JobGetDto>>(jobs);
            return Ok(convjob);
        }
        //Delete
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteJob(long id)
        {
            var deljob= await _context.Jobs.FindAsync(id);
            if (deljob == null)
            {
                return NotFound("Job not found");
            }
            var associatedCandidates = await _context.Candidates.AnyAsync(c => c.JobId == id);
            if (associatedCandidates)
            {
                return BadRequest("Unable to delete job as there are candidates associated with this job.");
            }
            _context.Jobs.Remove(deljob);
            await _context.SaveChangesAsync();
            return Ok("Job deleted successfully");
        }
    }
}
