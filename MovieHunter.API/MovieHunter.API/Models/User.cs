using System.Collections.Generic;
using Nancy.Security;

namespace MovieHunter.API.Models
{
	public class User : IUserIdentity
	{
		public string UserName { get; set; }
		public string Password { get; set; }
		public IEnumerable<string> Claims { get; set; }
	}
}