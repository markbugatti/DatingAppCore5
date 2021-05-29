using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Posts")]
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public Photo Photo { get; set; }
        public DateTime Created { get; set; }
        public int Views { get; set; }
        public int Like { get; set; }
        public int Dislike { get; set; }
        public AppUser AppUser { get; set; }
    }
}