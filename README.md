MovieHunter: Angular-WebAPI-MongoDB-TokenAuth
================================

Sample beginner Angular application using NancyFx + MongoDB + Nancy.Authentication.Token. 

This is a complete rewrite of the [original fork!](https://github.com/DeborahK/Angular-MovieHunter-WebAPI) Using **Nancy.Hosting.Aspnet** and MongoDB with the new **MongoDB.Driver 2.0.X** that I did for study purpose.


### Server Requirements

**MongoDB 3.0.X** You just need an clear installation of MongoDB, the custom bootstrapper will insert all data needed to get the project working right from the first run.  
For more information about installing:
http://docs.mongodb.org/manual/installation/

**NancyFX** was designed to not have any dependencies on existing frameworks. Built with the .NET framework client profile, Nancy can be used pretty much wherever you want to, since it’s completely self contained with its own request and response objects.
https://github.com/NancyFx/Nancy/wiki/Documentation#hosting

### For Xamarin Studio users

Since Xamarin don't support just websites projects and just one debug XSP running per instance, I've splitted the projects (API and UI), so you will need two separated Xamarin Studio's instances running. 

If you use Xamarin Studio on Mac and want an easy way to run multiple instances, don't forget to check this out:
http://redth.codes/Xamarin-Studio-Launcher-v3/