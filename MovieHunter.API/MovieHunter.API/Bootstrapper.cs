using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;
using MovieHunter.API.Models;
using Nancy.Authentication.Token;

namespace MovieHunter.API
{
	public class Bootstrapper : DefaultNancyBootstrapper
	{
		protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
		{
			base.ApplicationStartup(container, pipelines);

			StaticConfiguration.DisableErrorTraces = false;

		}
		protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
		{
			TokenAuthentication.Enable(pipelines, new TokenAuthenticationConfiguration(container.Resolve<ITokenizer>()));

			//CORS Enable
			pipelines.AfterRequest.AddItemToEndOfPipeline ((ctx) => {
				ctx.Response.WithHeader ("Access-Control-Allow-Origin", "*")
						.WithHeader ("Access-Control-Allow-Methods", "PUT,DELETE,POST,GET")
						.WithHeader ("Access-Control-Allow-Headers", "Accept, Origin, Content-type");

			});
		}

		protected override void ConfigureApplicationContainer(TinyIoCContainer container)
		{
			try {
				string connString = ConfigurationManager.AppSettings["MongoUrl"];
				string databaseName = ConfigurationManager.AppSettings["databaseName"];

				var client = new MongoClient(connString);
				var database = client.GetDatabase(databaseName);

				firstTimeInstallDataBase(database, RootPathProvider.GetRootPath());
				
				base.ConfigureApplicationContainer(container);

				container.Register<MongoClient>(client);
				container.Register<IMongoDatabase>(database);

				container.Register<ITokenizer>(new Tokenizer());
			}
			catch {
				throw;
			}
		}

		private async Task<bool> CollectionExistsAsync(IMongoDatabase database, string collectionName)
		{
			try {
				var filter = new BsonDocument("name", collectionName);
				//filter by collection name
				var collections = database.ListCollectionsAsync(new ListCollectionsOptions { Filter = filter });
				//check for existence
				return (await collections.Result.ToListAsync()).Any();
			}
			catch {
				throw;
			}
		}

		private async void firstTimeInstallDataBase (IMongoDatabase database, string rootPath){
			try {
				if (!CollectionExistsAsync (database, "actors").Result) {
					await database.CreateCollectionAsync ("actors");

					var actors = new ActorRepository();
					foreach (Actor actor in actors.Retrieve(rootPath))
					{
						var collectionActors = database.GetCollection<Actor>("actors");
						await collectionActors.InsertOneAsync(actor);
					}
				}

				if (!CollectionExistsAsync (database, "movies").Result) {
					await database.CreateCollectionAsync ("movies");

					var movies = new MovieRepository();
					foreach (Movie movie in movies.Retrieve(rootPath))
					{
						var collectionActors = database.GetCollection<Movie>("movies");
						await collectionActors.InsertOneAsync(movie);
					}
				}
			}
			catch {
				throw;
			}
		}

	}
}