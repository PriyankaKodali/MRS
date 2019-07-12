 let ApiUrl = "";
 let MRSUrl="";

   if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
       ApiUrl= "http://localhost:54093/"
       MRSUrl="http://localhost:58528/";
    } 
      else {
       ApiUrl = "https://maxmaster.azurewebsites.net/api"
       MRSUrl="https://maxmrs.azurewebsites.net/api";
   }

export { ApiUrl, MRSUrl };