using Nancy;
using Nancy.Security;
using Nancy.Authentication.Token;
using MongoDB.Driver;
using MovieHunter.API.Models;
using Nancy.ModelBinding;

namespace MovieHunter.API.Modules
{
	public class AuthModule : NancyModule
	{
		public AuthModule(IMongoDatabase database, ITokenizer tokenizer) : base("/api/auth")
		{
			Post["/"] = x =>
			{
				User user = this.Bind<User>(); // Nancy.ModelBinding

				var userIdentity = UserDAO.ValidateUser(user);

				if (userIdentity == null)
				{
					return HttpStatusCode.Unauthorized;
				}

				var token = tokenizer.Tokenize(userIdentity, Context);

				return new
				{
					id = token,
					user = new {
						id = userIdentity.UserName,
						roles = userIdentity.Claims
					}
				};
			};

			Get["/validation"] = _ =>
			{
				this.RequiresAuthentication();
				return "Yay! You are authenticated!";
			};

			Get["/admin"] = _ =>
			{
				this.RequiresClaims(new[] { "admin" });
				return "Yay! You are authorized!";
			};
		}
	}
}

