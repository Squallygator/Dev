using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.DynamicData.ModelProviders;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace MvcSandBox.Extensions
{
    public static class HtmlUtilsExtensions
    {
        public static MvcHtmlString ReadOnlyDropDownListFor<T, TV>(this HtmlHelper<T> html, Expression<Func<T, TV>> prop, IEnumerable<SelectListItem> values)
        {
            var val = prop.Compile().Invoke(html.ViewData.Model);
            return new MvcHtmlString(html.Hidden(prop.GetName(), val).ToHtmlString()
                + values.Where(_ => _.Value == val.ToString()).Select(_ => _.Text).FirstOrDefault());
        }

        public static string GetName<T, TV>(this Expression<Func<T, TV>> prop)
        {
            var expression = (MemberExpression)prop.Body;
            return expression.Member.Name;
        }
    }
}