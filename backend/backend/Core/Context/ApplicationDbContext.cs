using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Context
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {
            
        }

        public DbSet<Company> Companys { get; set; }
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<Job> Jobs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Job>()
                .HasOne(a => a.Company)
                .WithMany(company => company.Jobs)
                .HasForeignKey(a => a.CompanyId);

            modelBuilder.Entity<Candidate>()
                .HasOne(candidate=>candidate.Job)
                .WithMany(job=>job.Candidates)
                .HasForeignKey(candidate => candidate.JobId);

            modelBuilder.Entity<Company>()
                .Property(company => company.Size)
                .HasConversion<string>();

            modelBuilder.Entity<Job>()
                .Property(job=>job.Level)
                .HasConversion<string>();
        }
    }
}
