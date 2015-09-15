using Nancy;
using Nancy.Security;
using Nancy.Authentication.Token;
using MongoDB.Driver;
using MovieHunter.API.Models;

namespace MovieHunter.API.Modules
{
	public class AuthModule : NancyModule
	{
		public AuthModule(IMongoDatabase database, ITokenizer tokenizer) : base("/api/auth")
		{
			Post["/"] = x =>
			{
				var userName = (string)this.Request.Form.UserName;
				var password = (string)this.Request.Form.Password;

				var userIdentity = UserDAO.ValidateUser(userName, password);

				if (userIdentity == null)
				{
					return HttpStatusCode.Unauthorized;
				}

				var token = tokenizer.Tokenize(userIdentity, Context);

				return new
				{
					Token = token,
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

