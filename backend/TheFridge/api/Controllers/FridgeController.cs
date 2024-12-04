using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using api.Models;

namespace api.Controllers
{
    [Route("api/fridge")]
    [ApiController]
    public class FridgeController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public FridgeController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetALL()
        {
            var items = _context.Fridges.ToList();

            return Ok(items);
        }
        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var item = _context.Fridges.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public IActionResult AddFridgeItem([FromBody] Fridge fridge)
        {
            var existingItem = _context.Fridges
                                       .FirstOrDefault(f => f.Name == fridge.Name);

            if (existingItem != null)
            {
                return Conflict(new { message = "A fridge item with the same name and expiry date already exists." });
            }

            fridge.Id = 0;
            _context.Fridges.Add(fridge);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = fridge.Id }, fridge);
        }
        [HttpPut]
        [Route("{id}")]
        public IActionResult UpdateFridgeItem(int id, [FromBody] Fridge fridge)
        {
            if (id != fridge.Id)
            {
                return BadRequest(new { message = "The ID in the route does not match the ID of the fridge item." });
            }

            var existingFridgeItem = _context.Fridges.Find(id);
            if (existingFridgeItem == null)
            {
                return NotFound(new { message = "Fridge item not found." });
            }

            existingFridgeItem.Name = fridge.Name;
            existingFridgeItem.ExpiryDate = fridge.ExpiryDate;

            _context.SaveChanges();

            return NoContent();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteFridge(int id)
        {
            var fridgeItem = _context.Fridges.Find(id);
            if (fridgeItem == null)
            {
                return NotFound();
            }

            _context.Fridges.Remove(fridgeItem);
            _context.SaveChanges();

            return NoContent();
        }

        private bool FridgeExists(int id)
        {
            return _context.Fridges.Any(e => e.Id == id);
        }


    }
}
