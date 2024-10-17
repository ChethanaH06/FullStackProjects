using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Candidate;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        private IMapper _mapper;
        public CandidateController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        //CRUD

        //Create
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateCandidate([FromForm] CandidateCreateDto dto,IFormFile pdfFile)
        {
            //1. Save pdf to server
            //2. save url into our entity
            var fiveMegaByte = 5 * 1024 * 1024;
            var pdfMimeType = "application/pdf";
            if (pdfFile.Length > fiveMegaByte || pdfFile.ContentType != pdfMimeType)
            {
                return BadRequest("File is not valid");
            }
            var resumeUrl=Guid.NewGuid().ToString()+".pdf";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(),"documents","pdfs",resumeUrl);
            using(var stream = new FileStream(filePath, FileMode.Create))
            {
                await pdfFile.CopyToAsync(stream);
            }
            var newCandidate = _mapper.Map<Candidate>(dto);
            newCandidate.ResumeUrl = resumeUrl;
            await _context.Candidates.AddAsync(newCandidate);
            await _context.SaveChangesAsync();
            return Ok("Candidate saved successfully");
        }
        //Read
        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<CandidateGetDto>>> GetCandidates()
        {
            var candidate = await _context.Candidates.Include(can => can.Job).OrderByDescending(q=>q.CreatedAt).ToListAsync();
            var convertedcandidate = _mapper.Map<IEnumerable<CandidateGetDto>>(candidate);
            return Ok(convertedcandidate);
        }

        //Read (Download pdf file)
        [HttpGet]
        [Route("download/{url}")]
        public IActionResult DownloadPdfFile(string url)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "documents", "pdfs", url);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found");
            }
            var pdfBytes=System.IO.File.ReadAllBytes(filePath);
            var file = File(pdfBytes, "application/pdf", url);
            return file;
        }

        //Delete
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteCandidate(long id)
        {
                var delcand = await _context.Candidates.FindAsync(id);
                if (delcand == null)
                {
                    return NotFound("Candidate not found");
                }
                _context.Candidates.Remove(delcand);
                await _context.SaveChangesAsync();
                return Ok("Candidate deleted successfully");
        }

    }
}
