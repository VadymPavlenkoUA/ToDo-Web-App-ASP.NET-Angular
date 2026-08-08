using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Services.DTOs.Tasks;
using TodoApp.Services.Interfaces;



namespace TodoApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<TaskListResponse>> GetTasks(
            [FromQuery] string? search,
            [FromQuery] int? categoryId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var userId = GetUserId();

            var result = await _taskService.GetTasksAsync(userId, search, categoryId, pageNumber, pageSize);

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskResponse>> GetById(int id)
        {
            var userId = GetUserId();

            var result = await _taskService.GetByIdAsync(id, userId);

            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<TaskResponse>> Create(
            CreateTaskRequest request)
        {
            try
            {
                var userId = GetUserId();

                var result = await _taskService.CreateAsync(request, userId);

                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateTaskRequest request)
        {
            try
            {
                var userId = GetUserId();

                var updated = await _taskService.UpdateAsync(id, request, userId);

                if (!updated)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();

            var deleted = await _taskService.DeleteAsync(id, userId);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        private int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException();
            }

            return int.Parse(userId);
        }
    }
}
