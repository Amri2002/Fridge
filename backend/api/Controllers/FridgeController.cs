using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.EntityFrameworkCore;


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
        public async Task<IActionResult> GetALL()
        {
            var items = await _context.Fridges.ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var item = await _context.Fridges.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> AddFridgeItem([FromBody] Fridge fridge)
        {
            var existingItem = await _context.Fridges
                                             .FirstOrDefaultAsync(f => f.Name == fridge.Name);

            if (existingItem != null)
            {
                return Conflict(new { message = "A fridge item with the same name already exists." });
            }

            fridge.Id = 0;
            await _context.Fridges.AddAsync(fridge);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = fridge.Id }, fridge);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFridgeItem(int id, [FromBody] Fridge fridge)
        {
            if (id != fridge.Id)
            {
                return BadRequest(new { message = "The ID in the route does not match the ID of the fridge item." });
            }

            var existingFridgeItem = await _context.Fridges.FindAsync(id);
            if (existingFridgeItem == null)
            {
                return NotFound(new { message = "Fridge item not found." });
            }

            existingFridgeItem.Name = fridge.Name;
            existingFridgeItem.ExpiryDate = fridge.ExpiryDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFridge(int id)
        {
            var fridgeItem = await _context.Fridges.FindAsync(id);
            if (fridgeItem == null)
            {
                return NotFound();
            }

            _context.Fridges.Remove(fridgeItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
