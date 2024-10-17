using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Company;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        private IMapper _mapper;
        public CompanyController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        //CRUD

        //Create
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyCreateDto dto)
        {
            Company newCompany=_mapper.Map<Company>(dto);
            await _context.Companys.AddAsync(newCompany);
            await _context.SaveChangesAsync();
            return Ok("Company created successfully");
        }
        //Read
        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<CompanyGetDto>>> GetCompanies()
        {
            var companies = await _context.Companys.OrderByDescending(q=>q.CreatedAt).ToListAsync();
            var convertedcompany=_mapper.Map<IEnumerable<CompanyGetDto>>(companies);
            return Ok(convertedcompany);
        }

        //Update

        //Delete
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteCompany(long id)
        {
            var company = await _context.Companys.FindAsync(id);

            if (company == null)
            {
                return NotFound("Company not found");
            }
            var associatedJobs= await _context.Jobs.AnyAsync(c=>c.ID==id);
            if (associatedJobs) 
            {
                return BadRequest("Unable to delete the Company as Jobs are associated");
            }
            _context.Companys.Remove(company);
            await _context.SaveChangesAsync();

            return Ok("Company deleted successfully");

        }
    }
}
