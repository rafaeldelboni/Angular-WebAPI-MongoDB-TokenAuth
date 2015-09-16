using System;
using System.Linq;
using System.Collections.Generic;
using Nancy.Security;

namespace MovieHunter.API.Models
{
	public class UserDAO
	{
		private static readonly List<Tuple<string, string>> Users = new List<Tuple<string, string>>();
		private static readonly Dictionary<string, List<string>> Claims = new Dictionary<string, List<string>>();

		static UserDAO()
		{
			Users.Add(new Tuple<string, string>("demo", "demo"));
			Claims.Add("demo", new List<string> { "editor", "admin" });

			Users.Add(new Tuple<string, string>("nonadmin", "nonadmin"));
			Claims.Add("nonadmin", new List<string> { "editor", });
		}

		public static IUserIdentity ValidateUser(User login)
		{
			var user =  Users.FirstOrDefault(x => x.Item1 == login.UserName && x.Item2 == login.Password);
			if (user == null)
			{
				return null;
			}
				
			var claims = Claims[user.Item1];
			return new User {UserName = user.Item1, Claims = claims};
		}
	}
}

