using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Fridge
    {
        public int Id { get; set; }
        // Item Name
        public string Name { get; set; } = string.Empty;

        // Expiry Date
        public DateTime ExpiryDate { get; set; }
    }
}