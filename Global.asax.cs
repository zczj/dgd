using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace ZCZJ.Trade.Mobile
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            //RouteConfig.RegisterRoutes(RouteTable.Routes);
            RegisterRoutes(RouteTable.Routes);
        }
        public static void RegisterRoutes(RouteCollection routes)
        {

            routes.MapRoute("Tips", "tips/", new { controller = "tips", action = "Index" });
            routes.MapRoute("transfer", "transfer/", new { controller = "transfer", action = "Index" });
            routes.MapRoute("transferPage", "transfer/page-{page}/", new { controller = "transfer", action = "Index", page = "" });

            routes.MapRoute("transferdetail", "transfer/{id}.html", new { controller = "transfer", action = "Detail", id = "" });

            routes.MapRoute("Author", "author/{id}", new { controller = "author", action = "authorarticle" }, new { id = @"\d+" });

            routes.MapRoute("huodongDetail", "huodong/{id}.html", new { controller = "HuoDong", action = "Detail", id = "" });
            routes.MapRoute("knowledgeDetail", "knowledge/{id}.html", new { controller = "Knowledge", action = "Detail", id = "" });
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");


            routes.MapRoute("userinfo", "userinfo/{id}", new { controller = "userinfo", action = "Index", id = "" });

            routes.MapRoute("news", "news/", new { controller = "News2016", action = "Index", category = "" });
            routes.MapRoute("newsPage", "news/page-{page}/", new { controller = "News2016", action = "Index", category = (Int32)Common.CategoryEnum.资讯中心, page = "" });

            routes.MapRoute("project", "project/s{state}", new { controller = "project", action = "Index", state = "2" });

            routes.MapRoute("projectDetail", "project/{id}.html", new { controller = "project", action = "Detail", id = "" });

            routes.MapRoute("daohangDetail", "daohang/{id}.html", new { controller = "daohang", action = "Detail", id = "" });

            // routes.MapRoute("about", "about/{id}.html", new { controller = "about", action = "index", id = "" });
            //routes.MapRoute("aboutDetail", "about/{id}.html", new { controller = "about", action = "WebGGDetail", id = "" });

            routes.MapRoute("help", "help/{cid}.html", new { controller = "help", action = "detail", cid = "" });
            routes.MapRoute("helpClick", "help/{cid}/{id}.html", new { controller = "help", action = "detail", cid = "", id = "" });



            routes.MapRoute("newcategory", "news/c{category}/", new { controller = "news2016", action = "Index", category = "" });
            routes.MapRoute("newcategoryPage", "news/c{category}/page-{page}/", new { controller = "news2016", action = "Index", category = "", page = "" });
            routes.MapRoute("detail", "news/{date}/content_{id}.html", new { controller = "news2016", action = "Detail", date = "", id = "" });

            routes.MapRoute("lous", "mycenter/lous/page-{page}/", new { controller = "mycenter", action = "lous", page = "" });

            routes.MapRoute("article", "article/{date}/{id}.html", new { controller = "My", action = "article", date = "", id = "" });

            routes.MapRoute("tech", "tech/{date}/content_{id}.html", new { controller = "Tech", action = "Detail", date = "", id = "" });

            routes.MapRoute("specialdetail", "specialdetail/{id}", new { controller = "news2016", action = "SpecialDetails", id = "" });

            routes.MapRoute("tag", "news/tag/{id}", new { controller = "news2016", action = "SearchTag", id = "" });

            routes.MapRoute("specialcolumn", "specialcolumn/{id}", new { controller = "news2016", action = "SpecialHome", id = "" });

            routes.MapRoute("more", "news/more/{id}", new { controller = "news2016", action = "SearchDetail", id = "" });

            routes.MapRoute("column", "column/{id}", new { controller = "news2016", action = "ExpertColumn", id = "" });

            routes.MapRoute("specialpage", "specialpage/{c}", new { controller = "news2016", action = "SpecialPage", c = "", });

            routes.MapRoute("techcategory", "tech/c_{id}", new { controller = "Tech", action = "Index", id = "" });

            routes.MapRoute("techcategorypage", "tech/{id}/page-{page}", new { controller = "Tech", action = "Index", id = "", page = "" });

            routes.MapRoute("techPage", "tech/page-{page}/", new { controller = "Tech", action = "Index", page = "" });

            routes.MapRoute("sharetransfer", "sharetransfer/{id}.html", new { controller = "ShareTransfer", action = "Detail", id = "" });

            routes.MapRoute("knowledge", "knowledge/{id}/", new { controller = "Knowledge", action = "Index", id = "" });


            routes.MapRoute("huodong", "huodong/{state}/", new { controller = "HuoDong", action = "Index", state = "" });
            routes.MapRoute("huodongDetailPage", "huodong/{state}/page-{page}", new { controller = "HuoDong", action = "Index", page = "", state = "" });

            routes.MapRoute("zhongchouIndex", "zhongchou/", new { controller = "zhongchou", action = "Index", id = 0 });
            routes.MapRoute("zhongchou", "zhongchou/{id}.html", new { controller = "zhongchou", action = "Detail", id = 0 });

            routes.MapRoute("mycenter", "mycenter/", new { controller = "mycenter", action = "Index" });
            routes.MapRoute("PledgeApplication", "mycenter/pledgeapplication/{orderid}", new { controller = "mycenter", action = "pledgeapplication", orderid = "" });
            routes.MapRoute("PledgeBao", "mycenter/pledgebaolist/", new { controller = "mycenter", action = "pledgebaolist", page = "" });
            routes.MapRoute("PledgeBaoList", "mycenter/pledgebaolist/page-{page}", new { controller = "mycenter", action = "pledgebaolist", page = "" });
            routes.MapRoute("PledgeBaoDetail", "mycenter/PledgeDetail/{id}", new { controller = "mycenter", action = "pledgedetail", id = "" });

            routes.MapRoute(
                "Default", // 路由名称
                "{controller}/{action}/{id}", // 带有参数的 URL
                new { controller = "Index", action = "Index", id = UrlParameter.Optional } // 参数默认值
            );

        }
    }
}